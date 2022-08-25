import type { ReactElement } from "react";
import { fromFileUrl, Hono, logger } from "./deps.ts";
import { renderToStream } from "./render.ts";
import { ImportMap, Mode } from "./types.ts";
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
    public entrypoint: string,
  ) {
    super();
    this.use("*", logger());
  }

  async init() {
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

    return renderToStream(Component, {
      assetManifest: this.assetManifest,
      importMap: this.importMap,
      bootstrapModules: [this.entrypoint],
      ...options,
    });
  }

  async #parseJsonFile<T>(path: string): Promise<T> {
    const bytes = await fetch(path).then((response) => response.arrayBuffer());
    const content = new TextDecoder().decode(bytes);

    return JSON.parse(content);
  }

  #prepareEntrypoint(importMap: ImportMap) {
    const specifier = toUltraUrl(this.root, this.entrypoint, this.mode)!;

    if (this.mode === "production") {
      if (importMap.imports[fromFileUrl(specifier)]) {
        return importMap.imports[fromFileUrl(specifier)];
      }
    }

    return specifier;
  }
}
