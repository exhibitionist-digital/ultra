import type { ReactElement } from "react";
import { fromFileUrl, Hono, logger, resolve, toFileUrl } from "./deps.ts";
import { renderToStream } from "./render.tsx";
import { ImportMap, Mode } from "./types.ts";
import { toUltraUrl } from "./utils/url.ts";

type UltraServerRenderOptions = {
  generateStaticHTML?: boolean;
  flushEffectsToHead?: boolean;
};

export class UltraServer extends Hono {
  public importMap: ImportMap | undefined;

  constructor(
    public root: string,
    public mode: Mode,
    public importMapPath: string,
    public entrypoint: string,
  ) {
    super();
    this.use("*", logger());
  }

  async init() {
    /**
     * Resolve the importMapPath
     */
    this.importMapPath = this.#resolveImportMapPath(this.importMapPath);

    /**
     * Parse the provided importMap
     */
    this.importMap = await this.#parseImportMap(this.importMapPath);

    /**
     * Prepare the entrypoint
     */
    this.entrypoint = this.#prepareEntrypoint(this.importMap);
  }

  render(Component: ReactElement, options?: UltraServerRenderOptions) {
    if (!this.importMap) {
      throw new Error("Import map has not been parsed.");
    }

    return renderToStream(Component, {
      importMap: this.importMap,
      bootstrapModules: [this.entrypoint],
      ...options,
    });
  }

  #resolveImportMapPath(path: string) {
    if (this.mode === "development") {
      return path;
    }

    return toFileUrl(resolve(this.root, "./importMap.production.json")).href;
  }

  async #parseImportMap(path: string): Promise<ImportMap> {
    const bytes = await Deno.readFile(fromFileUrl(path));
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
