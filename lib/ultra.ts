import type { ReactElement } from "react";
import { ULTRA_COMPILER_PATH } from "./constants.ts";
import {
  fromFileUrl,
  Hono,
  logger,
  relative,
  resolve,
  sprintf,
} from "./deps.ts";
import { log } from "./logger.ts";
import { renderToStream } from "./render.ts";
import { Context, Env, ImportMap, Mode } from "./types.ts";
import { toUltraUrl } from "./utils/url.ts";

type UltraServerRenderOptions = {
  entrypoint?: string;
  generateStaticHTML?: boolean;
  enableEsModuleShims?: boolean;
  disableHydration?: boolean;
  flushEffectsToHead?: boolean;
};

type UltraServerOptions = {
  mode: Mode;
  importMapPath?: string;
  assetManifestPath: string;
  enableEsModuleShims?: boolean;
  esModuleShimsPath?: string;
  entrypoint?: string;
};

export class UltraServer<
  E extends Env = Env,
  // deno-lint-ignore ban-types
  S = {},
  BasePath extends string = "/",
> {
  public importMap: ImportMap | undefined;
  public assetManifest: Map<string, string> | undefined;

  public root: string;
  public mode: Mode;
  public baseUrl: string;
  public importMapPath?: string;
  public assetManifestPath: string;
  public enableEsModuleShims?: boolean;
  public esModuleShimsPath?: string;
  public entrypoint?: string;
  public ultraDir?: string;

  public wrappedServer: Hono<E, S, BasePath>;

  constructor(
    root: string,
    options: UltraServerOptions
  );
  constructor (
    root: string,
    options: UltraServerOptions,
    wrappedServer?: Hono<E, S, BasePath>,
  ) {
    this.wrappedServer = wrappedServer ?? new Hono<E, S, BasePath>();

    this.root = root;
    this.mode = options.mode;
    this.importMapPath = options.importMapPath;
    this.assetManifestPath = options.assetManifestPath;
    this.enableEsModuleShims = options.enableEsModuleShims;
    this.esModuleShimsPath = options.esModuleShimsPath;
    this.entrypoint = options.entrypoint;
    this.baseUrl = this.mode === "development"
      ? `${ULTRA_COMPILER_PATH}/`
      : "/";

    const logFn = options.mode === "development"
      ? (message: string) => log.info(message)
      : (message: string) => console.info(message);

    this.wrappedServer.use("*", logger(logFn));
  }

  async init() {
    log.debug("Initialising server");

    /**
     * Parse the importMap if provided
     */
    this.importMap = this.importMapPath
      ? await this.#parseJsonFile(this.importMapPath)
      : undefined;

    /**
     * Parse the provided asset manifest if we have an entrypoint
     */
    const assetManifest: [string, string][] | undefined =
      this.mode === "production"
        ? await this.#parseJsonFile(this.assetManifestPath)
        : undefined;

    this.assetManifest = assetManifest ? new Map(assetManifest) : undefined;

    /**
     * Prepare the entrypoint if provided an importMap
     */
    if (this.importMap) {
      this.#importMapHandler(this.importMap);
      this.entrypoint = this.#prepareEntrypoint(
        this.importMap,
        this.entrypoint,
      );
    }

    // Validate
    this.#valid();
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
    log.debug("Rendering component");

    let bootstrapModules: string[] = [];

    if (options?.entrypoint) {
      options.entrypoint = options?.entrypoint && this.importMap
        ? this.#prepareEntrypoint(this.importMap, options.entrypoint)
        : undefined;
    }

    const entrypoint = options?.entrypoint || this.entrypoint;

    if (entrypoint) {
      bootstrapModules = [
        entrypoint.startsWith("file://") ? fromFileUrl(entrypoint) : entrypoint,
      ];
    }

    return renderToStream(Component, context, {
      mode: this.mode,
      baseUrl: this.baseUrl,
      assetManifest: this.assetManifest,
      importMap: this.importMap,
      enableEsModuleShims: this.enableEsModuleShims,
      esModuleShimsPath: this.esModuleShimsPath,
      bootstrapModules,
      ...options,
    });
  }

  async #parseJsonFile<T>(path: string): Promise<T> {
    try {
      log.debug(sprintf("Parsing JSON: %s", path));

      const bytes = await fetch(path).then((response) =>
        response.arrayBuffer()
      );
      const content = new TextDecoder().decode(bytes);

      const json = JSON.parse(content);
      log.debug(json);

      return json;
    } catch (cause) {
      throw new Error(sprintf("Failed to parse JSON file at path: %s", path), {
        cause,
      });
    }
  }

  #importMapHandler(importMap: ImportMap | undefined) {
    if (importMap?.imports) {
      const ultraUrl = importMap.imports["ultra/"];
      // Set importMap for ultra/ framework
      if (ultraUrl && !ultraUrl.startsWith("http")) {
        if (ultraUrl.startsWith("/")) {
          this.ultraDir = ultraUrl;
        } else {
          this.ultraDir = resolve(Deno.cwd(), ultraUrl);
        }
        importMap.imports["ultra/"] = "/ultra/";
      }
    }
  }

  #valid() {
    // Check we have an importMap if we we're provided an entrypoint
    if (!this.importMap && this.entrypoint) {
      throw new Error("Import map has not been parsed.");
    }
  }

  #prepareEntrypoint(importMap: ImportMap, entrypoint?: string) {
    if (!entrypoint) {
      log.debug("No entrypoint provided, hydration disabled.");
      return entrypoint;
    }

    log.debug(sprintf("Resolving entrypoint: %s", entrypoint));

    let entrypointSpecifier = `./${
      relative(this.root, fromFileUrl(entrypoint))
    }`;

    if (this.mode === "production") {
      for (const [specifier, resolved] of Object.entries(importMap.imports)) {
        if (specifier === entrypointSpecifier) {
          entrypointSpecifier = resolved.replace("./", "/");
        }
      }
    } else {
      entrypointSpecifier = toUltraUrl(this.root, entrypoint, this.mode)!;
    }

    log.debug(sprintf("Resolved entrypoint: %s", entrypointSpecifier));

    return entrypointSpecifier;
  }
}
