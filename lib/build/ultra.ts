import {
  Builder,
  crayon,
  deepMerge,
  EntrypointConfig,
  FileBag,
  fromFileUrl,
  join,
  relative,
  resolve,
  sprintf,
  VirtualFile,
} from "./deps.ts";
import { Logger } from "../logger.ts";
import type { BuildOptions, BuildResult, DenoConfig } from "./types.ts";

type DefaultBuildOptions = Omit<
  BuildOptions,
  "browserEntrypoint" | "serverEntrypoint" | "plugin"
>;

const defaultOptions: DefaultBuildOptions = {
  root: Deno.cwd(),
  output: ".ultra",
  importMapPath: "./importMap.json",
  ignored: [".git", join("**", ".DS_Store")],
};

export class UltraBuilder extends Builder {
  public options: BuildOptions;

  public browserEntrypoint?: string;
  public serverEntrypoint: string;

  constructor(
    options: Partial<BuildOptions>,
    private onSuccessCallback?: (
      context: UltraBuilder,
      result: BuildResult,
    ) => Promise<void> | void,
  ) {
    const resolvedOptions = deepMerge<BuildOptions>(defaultOptions, options);
    const root = resolvedOptions.root;

    const output = resolvedOptions.output
      ? resolve(root, resolvedOptions.output)
      : resolve(root, ".ultra");

    super({
      root,
      output,
      name: "ultra",
      importMapPath: resolvedOptions.importMapPath,
      logLevel: "INFO",
      compiler: {
        minify: true,
        jsxImportSource: resolvedOptions.jsxImportSource,
        sourceMaps: resolvedOptions.sourceMaps,
      },
    });

    // Override the logger
    this.log = new Logger("INFO");

    this.options = resolvedOptions;
    this.browserEntrypoint = this.options.browserEntrypoint
      ? this.makeRelative(this.options.browserEntrypoint)
      : undefined;
    this.serverEntrypoint = this.makeRelative(this.options.serverEntrypoint);

    this.#initEntrypoints();
    this.#initIgnored();
    this.#initHashed();
    this.#initCompiled();
  }

  entrypoint(name: string, config: EntrypointConfig) {
    this.addEntrypoint(name, config);

    return this;
  }

  ignore(path: string) {
    this.ignored.push(super.globToRegExp(path));

    return this;
  }

  dynamicImportIgnore(path: string) {
    this.dynamicImportIgnored.push(super.globToRegExp(path));

    return this;
  }

  contentHash(path: string) {
    this.hashed.push(super.globToRegExp(path));

    return this;
  }

  async build(): Promise<BuildResult> {
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
     * Generate ./asset-manifest.json
     */
    const assetManifest = await this.#generateAssetManifest(result);
    generated.add(assetManifest);
    this.log.success("Generated asset-manifest.json");

    /**
     * Patch deno.json
     */
    await this.#patchDenoJsonConfig(result);

    /**
     * Copy any generated files to the output
     */
    await generated.copyTo(this.context.output);

    /**
     * If a build plugin is provided, execute it's build hooks
     */
    if (this.options.plugin) {
      const plugin = this.options.plugin;
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

  #initIgnored() {
    /**
     * Deno.mainModule will most definitely be a build.ts file in the project
     * We always exclude this.
     */
    const mainModule = this.makeRelative(Deno.mainModule);

    this.setIgnored([
      mainModule,
      ...(this.options.ignored || []),
    ]);

    // Exclude the compiler middleware from the build output
    this.dynamicImportIgnore(import.meta.resolve("../middleware/compiler.ts"));
  }

  #initHashed() {
    const hashed = [
      "./src/**/*.+(ts|tsx|js|jsx|css)",
      "./public/**/*.+(css|ico|webp|avif|jpg|png|svg|gif|otf|ttf|woff)",
      "./client.+(ts|tsx|js|jsx)",
    ];

    this.setHashed(hashed);
  }

  #initCompiled() {
    this.setCompiled([
      "./src/**/*.+(ts|tsx|js|jsx)",
      "./vendor/browser/**/*.+(ts|tsx|js|jsx)",
      "./+(client|server).+(ts|tsx|js|jsx)",
    ]);
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

  async #patchDenoJsonConfig(result: BuildResult) {
    const source = await result.outputSources.get("./deno.json");

    if (source) {
      const denoConfig = await source.readAsJson<DenoConfig>();
      if (denoConfig) {
        if (denoConfig.compilerOptions?.jsx) {
          denoConfig.compilerOptions.jsx = "react-jsx";
        }

        denoConfig.importMap = "./importMap.server.json";
        await source.write(JSON.stringify(denoConfig, null, 2), true);
        this.log.success("Patched deno.json");
      }
    }

    return source;
  }

  makeRelative(path: string) {
    return `./${
      relative(
        this.context.root,
        fromFileUrl(path),
      )
    }`;
  }
}
