import type { ReactElement } from "react";
import { ULTRA_COMPILER_PATH } from "./constants.ts";
import { fromFileUrl, Hono, logger, relative, sprintf } from "./deps.ts";
import { log } from "./logger.ts";
import { renderToStream } from "./render.ts";
import { Context, ImportMap, Mode } from "./types.ts";
import { toUltraUrl } from "./utils/url.ts";

type UltraServerRenderOptions = {
  generateStaticHTML?: boolean;
  disableHydration?: boolean;
  flushEffectsToHead?: boolean;
};

export class UltraServer extends Hono {
  public importMap: ImportMap | undefined;
  public assetManifest: Map<string, string> | undefined;

  constructor(
    public root: string,
    public mode: Mode,
    public importMapPath: string,
    public assetManifestPath: string,
    public enableEsModuleShims?: boolean,
    public esModuleShimsPath?: string,
    public entrypoint?: string,
  ) {
    super();
    this.use("*", logger((message) => log.info(message)));
  }

  async init() {
    log.debug("Initialising server");

    /**
     * Parse the provided importMap
     */
    this.importMap = await this.#parseJsonFile(this.importMapPath);

    /**
     * Parse the provided asset manifest if we have an entrypoint
     */
    const assetManifest: [string, string][] | undefined =
      this.mode === "production"
        ? await this.#parseJsonFile(this.assetManifestPath)
        : undefined;

    this.assetManifest = assetManifest ? new Map(assetManifest) : undefined;

    /**
     * Prepare the entrypoint
     */
    this.entrypoint = this.#prepareEntrypoint(this.importMap!);
  }

  render(
    Component: ReactElement,
    options?: UltraServerRenderOptions,
  ) {
    return this.renderWithContext(Component, undefined, options);
  }

  renderWithContext(
    Component: ReactElement,
    context: Context | undefined,
    options?: UltraServerRenderOptions,
  ) {
    this.#valid();
    log.debug("Rendering component");

    return renderToStream(Component, context, {
      baseUrl: this.mode === "development" ? `${ULTRA_COMPILER_PATH}/` : "/",
      assetManifest: this.assetManifest,
      importMap: this.importMap,
      enableEsModuleShims: this.enableEsModuleShims,
      esModuleShimsPath: this.esModuleShimsPath,
      bootstrapModules: this.entrypoint ? [this.entrypoint] : undefined,
      ...options,
    });
  }

  async #parseJsonFile<T>(path: string): Promise<T> {
    log.debug(sprintf("Parsing JSON: %s", path));
    const bytes = await fetch(path).then((response) => response.arrayBuffer());
    const content = new TextDecoder().decode(bytes);

    const json = JSON.parse(content);
    log.debug(json);

    return json;
  }

  #valid() {
    // Check we have an importMap if we we're provided an entrypoint
    if (!this.importMap && this.entrypoint) {
      throw new Error("Import map has not been parsed.");
    }
  }

  #prepareEntrypoint(importMap: ImportMap) {
    if (!this.entrypoint) {
      log.debug("No entrypoint provided, hydration disabled.");
      return this.entrypoint;
    }

    log.debug(sprintf("Resolving entrypoint: %s", this.entrypoint));

    let entrypointSpecifier = `./${
      relative(this.root, fromFileUrl(this.entrypoint))
    }`;

    if (this.mode === "production") {
      for (const [specifier, resolved] of Object.entries(importMap.imports)) {
        if (specifier === entrypointSpecifier) {
          entrypointSpecifier = resolved;
        }
      }
    } else {
      entrypointSpecifier = toUltraUrl(this.root, this.entrypoint, this.mode)!;
    }

    log.debug(sprintf("Resolved entrypoint: %s", entrypointSpecifier));

    return entrypointSpecifier;
  }
}
