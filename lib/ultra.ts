import type { ReactElement } from "react";
import { fromFileUrl, Hono, logger, relative, sprintf } from "./deps.ts";
import { log } from "./logger.ts";
import { renderToStream } from "./render.ts";
import { Context, ImportMap, Mode } from "./types.ts";
import { toUltraUrl } from "./utils/url.ts";

type UltraServerRenderOptions = {
  generateStaticHTML?: boolean;
  flushEffectsToHead?: boolean;
};

export class UltraServer extends Hono {
  public importMap: ImportMap | undefined;
  public assetManifest: Map<string, string> = new Map();

  constructor(
    public root: string,
    public mode: Mode,
    public importMapPath: string,
    public assetManifestPath: string,
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
     * Parse the provided asset manifest
     */
    const assetManifest: [string, string][] | undefined =
      this.mode === "production"
        ? await this.#parseJsonFile(this.assetManifestPath)
        : undefined;

    this.assetManifest = assetManifest ? new Map(assetManifest) : new Map();

    /**
     * Prepare the entrypoint
     */
    this.entrypoint = this.#prepareEntrypoint(this.importMap!);
  }

  render(
    Component: ReactElement,
    options?: UltraServerRenderOptions,
  ) {
    this.#valid();

    log.debug("Rendering component");

    return renderToStream(Component, undefined, {
      assetManifest: this.assetManifest,
      importMap: this.importMap!,
      bootstrapModules: this.entrypoint ? [this.entrypoint] : undefined,
      ...options,
    });
  }

  renderWithContext(
    Component: ReactElement,
    context: Context,
    options?: UltraServerRenderOptions,
  ) {
    this.#valid();

    log.debug("Rendering component");

    return renderToStream(Component, context, {
      assetManifest: this.assetManifest,
      importMap: this.importMap!,
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
    if (!this.importMap) {
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
