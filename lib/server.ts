import { ULTRA_COMPILER_PATH } from "./constants.ts";
import { assert, Hono, resolve, toFileUrl } from "./deps.ts";
import { ensureMinDenoVersion } from "./dev/ensureMinDenoVersion.ts";
import { serveStatic } from "./middleware/serveStatic.ts";
import { CreateServerOptions, Mode } from "./types.ts";
import { UltraServer } from "./ultra.ts";
import { log } from "./logger.ts";
import { resolveImportMapPath } from "./utils/import-map.ts";

/**
 * Check if we are running on Deno Deploy and set the mode to production
 * if the mode hasn't been specified via the environment.
 */
const modeFromEnv = Deno.env.get("ULTRA_MODE") ||
  (Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined ? "production" : undefined);

const defaultOptions = {
  mode: (modeFromEnv || "development") as Mode,
};

export async function createServer(
  options: CreateServerOptions,
) {
  const resolvedOptions = {
    ...defaultOptions,
    ...options,
  };

  assertServerOptions(resolvedOptions);

  const { mode = "development", browserEntrypoint } =
    resolvedOptions as Required<CreateServerOptions>;

  const root = Deno.cwd();
  const importMapPath = resolveImportMapPath(mode, root, options.importMapPath);
  const assetManifestPath =
    toFileUrl(resolve(root, "asset-manifest.json")).href;

  const server = new UltraServer(
    root,
    mode,
    importMapPath,
    assetManifestPath,
    browserEntrypoint,
  );

  await server.init();

  /**
   * We always try to serve public assets before
   * anything else.
   */
  server.use(
    "*",
    serveStatic({
      root: resolve(root, "./public"),
      cache: mode !== "development",
    }),
  );

  if (mode === "development") {
    log.info("Loading compiler");
    const { compiler } = await import("./middleware/compiler.ts");

    server.use(
      `${ULTRA_COMPILER_PATH}/*`,
      compiler({
        mode,
        root,
        ...options.compilerOptions,
      }),
    );
  } else {
    /**
     * Serve anything else static at "/"
     */
    server.use(
      "*",
      serveStatic({
        root: resolve(root, "./"),
        cache: true,
      }),
    );
  }

  return server;
}

export function createRouter() {
  const router = new Hono();
  return router;
}

export function assertServerOptions(options: CreateServerOptions) {
  try {
    /**
     * Ensure we are running a supported Deno version
     */
    options.mode === "development" && ensureMinDenoVersion();

    /**
     * Assert that we are provided a valid "mode"
     */
    assert(
      ["development", "production"].includes(options.mode!),
      `Invalid value supplied for "mode", expected either "production" or "development" received "${options.mode}"`,
    );

    /**
     * Assert that we are provided an importMapPath
     */
    assert(options.importMapPath, "No importMapPath was supplied");

    /**
     * Assert that we are provided a browserEntrypoint
     */
    assert(
      `A browser entrypoint was not provided "${options.browserEntrypoint}"`,
    );
  } catch (error) {
    throw new Error(error.message);
  }
}
