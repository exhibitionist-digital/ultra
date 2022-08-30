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

import type { BuildOptions, BuildResult, DenoConfig } from "./types.ts";

const defaultOptions: Omit<
  BuildOptions,
  "browserEntrypoint" | "serverEntrypoint" | "plugin"
> = {
  output: ".ultra",
  importMap: "./importMap.json",
  exclude: [".git", join("**", ".DS_Store")],
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
    const root = Deno.cwd();
    const output = resolvedOptions.output
      ? resolve(root, resolvedOptions.output)
      : resolve(root, ".ultra");

    super({
      root,
      output,
      name: "ultra",
      importMap: resolvedOptions.importMap,
      logLevel: "INFO",
      compiler: {
        minify: true,
        jsxImportSource: resolvedOptions.jsxImportSource,
        sourceMaps: resolvedOptions.sourceMaps,
      },
    });

    this.options = resolvedOptions;
    this.browserEntrypoint = this.options.browserEntrypoint
      ? this.makeRelative(this.options.browserEntrypoint)
      : undefined;
    this.serverEntrypoint = this.makeRelative(this.options.serverEntrypoint);

    this.initEntrypoints();
    this.initExcluded();
    this.initHashed();
  }

  initEntrypoints() {
    const entrypoints: Record<string, EntrypointConfig> = {};

    if (this.browserEntrypoint) {
      entrypoints[this.browserEntrypoint] = {
        vendorOutputDir: "browser",
        target: "browser",
      };
    }

    entrypoints[this.serverEntrypoint] = {
      vendorOutputDir: "server",
      target: "deno",
    };

    this.setEntrypoints(entrypoints);
  }

  initExcluded() {
    const mainModule = this.makeRelative(Deno.mainModule);

    this.setExcluded([
      mainModule,
      ...(this.options.exclude || []),
    ]);
  }

  initHashed() {
    const hashed = [
      "./src/**/*.+(ts|tsx|js|jsx|css)",
      "./public/**/*.+(css|ico|webp|avif|jpg|png|svg|gif|otf|ttf|woff)",
    ];

    if (this.browserEntrypoint) {
      hashed.push(this.browserEntrypoint);
    }

    this.setHashed(hashed);

    this.setCompiled([
      "./**/*.+(ts|tsx|js|jsx)",
    ]);
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
     * Copy sources to output
     */
    const buildSources = await this.copySources(sources);

    /**
     * Execute the build
     */
    const result = await super.build(buildSources);

    /**
     * Remove the dev importMap
     */
    await buildSources.get(this.options.importMap).then((source) =>
      source.remove()
    );

    /**
     * Generate ./asset-manifest.json
     */
    await this.#generateAssetManifest(buildSources);

    /**
     * Patch deno.json
     */
    await this.#patchDenoJsonConfig(buildSources);

    if (this.options.plugin) {
      this.log.info(
        sprintf(
          "Starting build plugin %s",
          crayon.lightBlue(this.options.plugin.name),
        ),
      );
      await this.options.plugin.onBuild(this, result);
    }

    this.log.success("Build complete");

    if (this.onSuccessCallback) {
      await this.onSuccessCallback(this, result);
    }

    return result;
  }

  async #generateAssetManifest(sources: FileBag) {
    this.log.info("Generating asset-manifest.json");
    const manifest = this.toManifest(sources, {
      exclude: [
        "./deno.json",
        "./importMap*.json",
      ],
      prefix: "/",
    });

    const assetManifest = manifest.map(([relative, absolute]) => {
      return [
        relative.replace("./public/", "./"),
        absolute.replace("/public/", "/"),
      ];
    });

    const assetManifestSource = new VirtualFile(
      "./asset-manifest.json",
      this.context.output,
      JSON.stringify(assetManifest, null, 2),
    );

    await this.copySource(assetManifestSource, this.context.output);
  }

  async #patchDenoJsonConfig(sources: FileBag) {
    this.log.info("Patching deno.json");
    const source = await sources.get("./deno.json");

    if (source) {
      const denoConfig = await source.readAsJson<DenoConfig>();
      if (denoConfig) {
        if (denoConfig.compilerOptions?.jsx) {
          denoConfig.compilerOptions.jsx = "react-jsx";
        }
        denoConfig.importMap = "./importMap.server.json";
        await source.writeJson(denoConfig, true);
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
