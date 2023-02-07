import { log } from "../logger.ts";
import { makeRelative } from "../utils/fs.ts";
import { assertEntrypointExists } from "./assert.ts";
import {
  Builder,
  ContextBuilder,
  crayon,
  deepMerge,
  EntrypointConfig,
  FileBag,
  join,
  resolve,
  sprintf,
  VirtualFile,
} from "./deps.ts";
import type {
  BuildOptions,
  BuildPlugin,
  BuildResult,
  DenoConfig,
  PatternLike,
} from "./types.ts";

type DefaultBuildOptions = Omit<
  BuildOptions,
  "browserEntrypoint" | "serverEntrypoint" | "plugin"
>;

const defaultOptions: DefaultBuildOptions = {
  root: Deno.cwd(),
  output: ".ultra",
  vendorPath: "vendor",
  vendorDependencies: true,
  inlineServerDynamicImports: false,
  importMapPath: "./importMap.json",
  ignored: [".git", join("**", ".DS_Store")],
};

type OnSuccessCallback = (
  builder: UltraBuilder,
  result: BuildResult,
) => Promise<void> | void;

export class UltraBuilder extends Builder {
  public browserEntrypoint?: string;
  public serverEntrypoint: string;
  public inlineServerDynamicImports: boolean;

  private plugin?: BuildPlugin;
  private resolvedOptions: BuildOptions;

  constructor(
    options: Partial<BuildOptions>,
    private onSuccessCallback?: OnSuccessCallback,
  ) {
    const resolvedOptions = deepMerge<BuildOptions>(defaultOptions, options);

    const root = resolvedOptions.root;
    const output = resolve(root, resolvedOptions.output || ".ultra");

    const browserEntrypoint = resolvedOptions.browserEntrypoint
      ? makeRelative(root, resolvedOptions.browserEntrypoint)
      : undefined;

    const serverEntrypoint = makeRelative(
      root,
      resolvedOptions.serverEntrypoint,
    );

    const context = new ContextBuilder()
      .setRoot(root)
      .setOutput(output)
      .setVendorPath(resolvedOptions.vendorPath)
      .setVendorDependencies(resolvedOptions.vendorDependencies)
      .setImportMapPath(resolvedOptions.importMapPath)
      .ignore(makeRelative(root, Deno.mainModule))
      .ignore(options.ignored || [])
      .dynamicImportIgnore([
        import.meta.resolve("../middleware/compiler.ts"),
      ])
      .contentHash([
        "./src/**/*.+(ts|tsx|js|jsx|css)",
        "./public/**/*.+(css|ico|webp|avif|jpg|png|svg|gif|otf|ttf|woff)",
        "./client.+(ts|tsx|js|jsx)",
      ])
      .compile([
        "./**/*.+(ts|tsx|js|jsx)",
        "!./vendor/server/**/*",
      ])
      .build();

    super(context, {
      compilerOptions: {
        minify: true,
        development: false,
        jsxImportSource: resolvedOptions.jsxImportSource,
      },
    });

    this.resolvedOptions = resolvedOptions;

    // Override the logger
    this.log = log;
    this.plugin = options.plugin;
    this.inlineServerDynamicImports =
      resolvedOptions.inlineServerDynamicImports;

    this.browserEntrypoint = browserEntrypoint;
    this.serverEntrypoint = serverEntrypoint;

    this.#initEntrypoints();
  }

  entrypoint(name: string, config: EntrypointConfig) {
    this.addEntrypoint(name, config);

    return this;
  }

  ignore(path: PatternLike) {
    this.context.ignored.add(path);

    return this;
  }

  dynamicImportIgnore(path: PatternLike) {
    this.context.dynamicImportIgnored.add(path);

    return this;
  }

  compile(path: PatternLike) {
    this.context.compiled.add(path);

    return this;
  }

  contentHash(path: PatternLike) {
    this.context.hashed.add(path);

    return this;
  }

  async build(): Promise<BuildResult> {
    /**
     * Validate the build
     */
    await this.#validate();

    /**
     * Clean the output directory
     */
    await this.cleanOutput();

    /**
     * Gather all sources from root
     */
    const sources = await this.gatherSources();

    /**
     * Execute the build
     */
    const result = await super.build(sources);
    const generated = new FileBag();

    for (const [entrypointName, importMap] of result.importMaps.entries()) {
      generated.add(
        new VirtualFile(
          `./importMap.${entrypointName}.json`,
          this.context.output,
          JSON.stringify(importMap, null, 2),
        ),
      );
    }

    /**
     * Inject dyanmic imports into the server entrypoint
     */
    if (this.inlineServerDynamicImports) {
      const serverEntrypointSource = result.outputSources.find((source) => {
        return source.originalPath().relativePath() === this.serverEntrypoint;
      });

      if (serverEntrypointSource) {
        const dynamicImports = Array.from(result.dynamicImports).map(
          (dynamicImport) => `import "${dynamicImport.relativePath()}";`,
        ).join("");

        const content = await serverEntrypointSource.read();
        const serverInlinedContent = dynamicImports + content;

        generated.add(
          new VirtualFile(
            serverEntrypointSource.path(),
            serverEntrypointSource.root(),
            serverInlinedContent,
          ),
        );
      }
    }

    /**
     * Generate ./asset-manifest.json
     */
    const assetManifest = await this.#generateAssetManifest(result);
    generated.add(assetManifest);
    this.log.success("Generated asset-manifest.json");

    /**
     * Patch deno.json
     */
    await this.#patchDenoJsonConfig(this.resolvedOptions, result);

    /**
     * Copy any generated files to the output
     */
    await generated.copyTo(this.context.output);

    /**
     * If a build plugin is provided, execute it's build hooks
     */
    if (this.plugin) {
      const plugin = this.plugin;
      try {
        this.log.info(
          sprintf(
            "Starting build plugin %s",
            crayon.lightBlue(plugin.name),
          ),
        );
        await plugin.onBuild(this, result);
      } catch (error) {
        this.log.error(
          sprintf(
            "Build plugin %s failed, see below for details",
            crayon.lightBlue(plugin.name),
          ),
        );
        this.log.error(error);
        Deno.exit(1);
      }
    }

    this.log.success("Build complete");

    if (this.onSuccessCallback) {
      await this.onSuccessCallback(this, result);
    }

    return result;
  }

  async #validate() {
    this.log.debug("Validating build");

    try {
      // Assert that the entrypoints exist
      if (this.browserEntrypoint) {
        await assertEntrypointExists(this.browserEntrypoint, "browser");
      }

      await assertEntrypointExists(this.serverEntrypoint!, "server");
      this.log.success("Build is valid");
    } catch (error) {
      this.log.error(error.message);
      Deno.exit(1);
    }
  }

  #initEntrypoints() {
    if (this.browserEntrypoint) {
      this.entrypoint("browser", {
        path: this.browserEntrypoint,
        target: "browser",
      });
    }

    this.entrypoint("server", {
      path: this.serverEntrypoint,
      target: "deno",
    });
  }

  #generateAssetManifest(result: BuildResult) {
    this.log.info("Generating asset-manifest.json");

    const sources = result.outputSources.filter((source) =>
      source.relativePath().startsWith("./public")
    );

    const manifest = this.toManifest(sources, {
      prefix: "/",
    });

    const assetManifest = manifest.map(([relative, absolute]) => {
      return [
        relative.replace("./public/", "/"),
        absolute.replace("/public/", "/"),
      ];
    });

    return new VirtualFile(
      "./asset-manifest.json",
      this.context.output,
      JSON.stringify(assetManifest, null, 2),
    );
  }

  async #patchDenoJsonConfig(options: BuildOptions, result: BuildResult) {
    const source = await result.outputSources.get("./deno.json");

    if (source) {
      const denoConfig = await source.readAsJson<DenoConfig>();
      if (denoConfig) {
        if (denoConfig.compilerOptions?.jsx) {
          denoConfig.compilerOptions.jsx = "react-jsx";
        }

        if (!options.vendorDependencies && denoConfig.tasks?.start) {
          denoConfig.tasks.start = denoConfig.tasks.start
            .replace(" --no-remote", "");
        }

        denoConfig.importMap = "./importMap.server.json";
        await source.write(JSON.stringify(denoConfig, null, 2), true);
        this.log.success("Patched deno.json");
      }
    }

    return source;
  }

  makeRelative(path: string) {
    return makeRelative(
      this.context.root,
      path,
    );
  }
}
