import { wait } from "https://deno.land/x/wait@0.1.12/mod.ts";
import { ULTRA_COMPILER_PATH, ULTRA_STATIC_PATH } from "./constants.ts";
import { assert, dirname, fromFileUrl, Hono } from "./deps.ts";
import { serveCompiled } from "./middleware/serveCompiled.ts";
import { serveStatic } from "./middleware/serveStatic.ts";
import { CreateServerOptions, Mode } from "./types.ts";
import { UltraServer } from "./ultra.ts";
import { exists } from "./utils/fs.ts";
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

  await assertServerOptions(resolvedOptions);

  const { mode = "development", browserEntrypoint } =
    resolvedOptions as Required<CreateServerOptions>;

  const root = fromFileUrl(dirname(browserEntrypoint));
  const importMapPath = resolveImportMapPath(mode, root, options.importMapPath);
  const server = new UltraServer(root, mode, importMapPath, browserEntrypoint);

  await server.init();

  if (mode === "development") {
    console.log(`Using browser entrypoint: ${browserEntrypoint}`);

    const spinner = wait("Loading compiler").start();
    const { compiler } = await import("./middleware/compiler.ts");

    spinner.stop();

    server.use(
      `${ULTRA_COMPILER_PATH}/*`,
      compiler({
        mode,
        root,
        ...options.compilerOptions,
      }),
    );
  } else {
    server.use(
      "/vendor/*",
      serveStatic({ root: "./", cache: mode === "production" }),
    );
    server.use(`${ULTRA_STATIC_PATH}/*`, serveCompiled({ root }));
  }

  server.use(
    "*",
    serveStatic({ root: "./public", cache: mode === "production" }),
  );

  return server;
}

export function createRouter() {
  const router = new Hono();
  return router;
}

export async function assertServerOptions(options: CreateServerOptions) {
  try {
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
     * Assert that the "browserEntrypoint" exists
     */
    assert(
      await exists(options.browserEntrypoint) === true,
      `A browser entrypoint was not found at path "${options.browserEntrypoint}"`,
    );
  } catch (error) {
    throw new Error(error.message);
  }
}
