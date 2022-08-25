import type { ReactElement } from "react";
import { Hono, logger, sprintf } from "./deps.ts";
import { renderToStream } from "./render.ts";
import { ImportMap, Mode } from "./types.ts";
import { toUltraUrl } from "./utils/url.ts";
import { log } from "./logger.ts";

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
    public entrypoint: string,
  ) {
    super();
    this.use("*", logger());
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

  render(Component: ReactElement, options?: UltraServerRenderOptions) {
    if (!this.importMap) {
      throw new Error("Import map has not been parsed.");
    }

    log.debug("Rendering component");

    return renderToStream(Component, {
      assetManifest: this.assetManifest,
      importMap: this.importMap,
      bootstrapModules: [this.entrypoint],
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

  #prepareEntrypoint(importMap: ImportMap) {
    log.debug(sprintf("Resolving entrypoint: %s", this.entrypoint));
    let specifier = toUltraUrl(this.root, this.entrypoint, this.mode)!;

    if (this.mode === "production") {
      for (const [, resolved] of Object.entries(importMap.imports)) {
        if (resolved === specifier) {
          specifier = resolved;
        }
      }
    }

    log.debug(sprintf("Resolved entrypoint: %s", specifier));

    return specifier;
  }
}
