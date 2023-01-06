import { ULTRA_COMPILER_PATH } from "./constants.ts";
import {
  assert,
  cache,
  dotenv,
  etag,
  Hono,
  resolve,
  toFileUrl,
} from "./deps.ts";
import { ensureMinDenoVersion } from "./dev/ensureMinDenoVersion.ts";
import { log } from "./logger.ts";
import { serveStatic } from "./middleware/serveStatic.ts";
import { CreateServerOptions, Mode } from "./types.ts";
import { UltraServer } from "./ultra.ts";
import { resolveImportMapPath } from "./utils/import-map.ts";
import { compiler } from "./middleware/compiler.ts";

/**
 * Dotenv
 */
await dotenv({ export: true });

/**
 * Check if we are running on Deno Deploy and set the mode to production
 * if the mode hasn't been specified via the environment.
 */
const modeFromEnv = Deno.env.get("ULTRA_MODE") ||
  (Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined ? "production" : undefined);

const defaultOptions = {
  mode: (modeFromEnv || "development") as Mode,
  enableEsModuleShims: true,
  esModuleShimsPath:
    "https://ga.jspm.io/npm:es-module-shims@1.6.2/dist/es-module-shims.js",
};

export async function createServer(
  options: CreateServerOptions = {},
): Promise<UltraServer> {
  const resolvedOptions = {
    ...defaultOptions,
    ...options,
  };

  assertServerOptions(resolvedOptions);

  const {
    mode = "development",
    browserEntrypoint,
    enableEsModuleShims,
    esModuleShimsPath,
  } = resolvedOptions;

  const root = Deno.cwd();
  const assetManifestPath = toFileUrl(resolve(root, "asset-manifest.json"));

  const server = new UltraServer(root, {
    mode,
    entrypoint: browserEntrypoint,
    importMapPath: options.importMapPath
      ? resolveImportMapPath(mode, root, options.importMapPath)
      : undefined,
    assetManifestPath: String(assetManifestPath),
    enableEsModuleShims,
    esModuleShimsPath,
  });

  await server.init();

  // Initalize etag middleware
  server.use("*", etag({ weak: false }));
  server.get(
    "*",
    cache({ cacheName: "my-app", cacheControl: "max-age=3600", wait: true }),
  );

  // We always try to serve public assets before anything else.
  // deno-fmt-ignore
  server.get("*", serveStatic({
    root: resolve(root, "./public"),
    cache: mode !== "development",
  }));

  // Serve anything else static at "/"
  // deno-fmt-ignore
  server.get("*", serveStatic({
    root: resolve(root, "./"),
    cache: mode !== "development",
  }));

  if (mode === "development" || mode === "jit") {
    log.info(
      "Loading compiler" +
        (mode === "jit" ? " in JIT mode" : " in development mode"),
    );
    // deno-fmt-ignore
    server.get(`${ULTRA_COMPILER_PATH}/*`, compiler({
      root,
      ...options.compilerOptions,
    }));
  }

  return server;
}

export function createRouter() {
  return new Hono();
}

export function assertServerOptions(
  options: CreateServerOptions,
): options is Required<CreateServerOptions> {
  try {
    /**
     * Ensure we are running a supported Deno version
     */
    options.mode === "development" && ensureMinDenoVersion();

    /**
     * Assert that we are provided a valid "mode"
     */
    assert(
      ["development", "production", "jit"].includes(options.mode!),
      `Invalid value supplied for "mode", expected either "production", "jit, or "development"; received "${options.mode}"`,
    );

    /**
     * Assert that we are provided an importMapPath if a browserEntrypoint is provided
     */
    if (options.browserEntrypoint) {
      assert(
        options.importMapPath,
        "No importMapPath was supplied, yet a browserEntrypoint has been set.",
      );
    }

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}
