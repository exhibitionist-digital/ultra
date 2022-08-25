import {
  brightBlue,
  deepMerge,
  emptyDir,
  green,
  join,
  outdent,
  relative,
  resolve,
  underline,
  wait,
} from "./lib/build/deps.ts";
import { sprintf } from "./lib/deps.ts";
import { compileSources } from "./lib/build/compileSources.ts";
import { copySource } from "./lib/build/copySource.ts";
import { createGraph } from "./lib/build/createGraph.ts";
import { patchDenoConfig } from "./lib/build/patchDenoConfig.ts";
import { resolvePaths } from "./lib/build/resolvePaths.ts";
import { vendorDependencies } from "./lib/build/vendorDependencies.ts";
import { assert } from "./lib/deps.ts";
import { cleanup } from "./lib/build/cleanup.ts";
import type {
  BuildOptions,
  BuildPlugin,
  BuildResult,
} from "./lib/build/types.ts";
import { createBuildContext } from "./lib/build/context.ts";
import { createAssetManifest } from "./lib/build/assetManifest.ts";
import { writeJsonFile } from "./lib/utils/json.ts";
import { patchImportMap } from "./lib/build/patchImportMap.ts";

/**
 * Re-export these types as convenience to build plugin authors
 */
export type { BuildPlugin };

const defaultOptions: Partial<BuildOptions> = {
  output: ".ultra",
  reload: false,
  sourceMaps: false,
  exclude: [
    ".git",
    join("**", ".DS_Store"),
  ],
};

const cwd = Deno.cwd();
const BUILD_COMPLETE_MESSAGE = "Build complete!";

function cwdRelative(path: string) {
  return relative(cwd, path);
}

export default async function build(
  options: BuildOptions,
): Promise<BuildResult> {
  const resolvedOptions = deepMerge(defaultOptions, options);

  await assertBuildOptions(resolvedOptions);

  const {
    browserEntrypoint,
    serverEntrypoint,
    output,
    sourceMaps,
    reload,
    plugin,
    exclude,
  } = resolvedOptions as Required<BuildOptions>;

  const spinner = wait("Building").start();

  /**
   * Resolve paths for build inputs/outputs
   */
  const paths = resolvePaths(output, {
    browserEntrypoint,
    serverEntrypoint,
    exclude: [...exclude, output],
  });

  /**
   * Prepare the BuildContext
   */
  const buildContext = createBuildContext(paths);

  spinner.text = sprintf(
    "Cleaning output directory: %s",
    cwdRelative(buildContext.paths.outputDir),
  );

  await emptyDir(buildContext.paths.outputDir);

  /**
   * Run plugin onPreBuild if available
   */
  try {
    if (plugin && plugin.onPreBuild) {
      await plugin.onPreBuild(buildContext);
    }
  } catch (error) {
    console.error(error);
  }

  /**
   * Copy everything from rootDir into outputDir
   */
  spinner.text = sprintf(
    "Copying source from: %s to %s",
    buildContext.paths.rootDir,
    cwdRelative(buildContext.paths.outputDir),
  );
  await copySource(buildContext);

  /**
   * Build a module graph from the provided entry points
   */
  spinner.text = "Building module graph";
  buildContext.graph = await createGraph(
    buildContext,
  );

  /**
   * Compile the sources found in the module graph
   */
  spinner.text = "Compiling and minifying sources";
  const compiled = await compileSources(buildContext, {
    sourceMaps,
    hash: true,
  });

  /**
   * Vendor dependencies
   */
  spinner.text = "Vendoring browser dependencies";

  let [browserImportMap, serverImportMap] = await Promise.all([
    vendorDependencies(buildContext, {
      target: "browser",
      reload,
      paths: [...Array.from(compiled.values())],
    }),
    vendorDependencies(buildContext, {
      target: "server",
      reload,
    }),
  ]);

  /**
   * Patch the importMaps with resolved import specifiers
   */
  browserImportMap = patchImportMap(
    buildContext,
    compiled,
    browserImportMap,
    "browser",
  );

  serverImportMap = patchImportMap(
    buildContext,
    compiled,
    serverImportMap,
    "server",
  );

  /**
   * Write the new importMaps
   */
  await Promise.all([
    writeJsonFile(
      resolve(paths.outputDir, "./importMap.browser.json"),
      browserImportMap,
    ),
    writeJsonFile(
      resolve(paths.outputDir, "./importMap.server.json"),
      serverImportMap,
    ),
  ]);

  /**
   * Create the asset manifest
   */
  const assets = await createAssetManifest(buildContext, {
    // TODO: We need a default exclusion list
    exclude: ["robots.txt"],
  });

  /**
   * Patch deno.json with required options
   */
  const denoConfig = await patchDenoConfig(paths);

  /**
   * Cleanup build output
   */
  await cleanup(paths);

  /**
   * Prepare the build result
   */
  const buildResult: BuildResult = {
    options: resolvedOptions,
    paths,
    importMap: {
      browser: browserImportMap,
      server: serverImportMap,
    },
    assetManifest: assets,
    denoConfig,
    files: buildContext.files,
  };

  const finalBuildResult = buildResult;

  /**
   * If we are supplied an build plugin, execute that now
   * with the current build result.
   */
  if (plugin) {
    try {
      spinner.text = sprintf("Executing build plugin: %s:onBuild", plugin.name);

      await plugin.onBuild(finalBuildResult);

      if (plugin.onPostBuild) {
        spinner.text = sprintf(
          "Executing build plugin: %s:onPostBuild",
          plugin.name,
        );

        await plugin.onPostBuild(finalBuildResult);
      }

      spinner.succeed(BUILD_COMPLETE_MESSAGE);
    } catch (error) {
      spinner.fail(error.message);
    }
  } else {
    spinner.succeed(BUILD_COMPLETE_MESSAGE);
    // deno-fmt-ignore
    console.log(outdent`\n
      You can now deploy the "${brightBlue(output)}" output directory to a platform of your choice.
      Instructions for common deployment platforms can be found at ${green('https://ultrajs.dev/docs#deploying')}.\n
      Alternatively, you can cd into "${brightBlue(output)}" and run: ${underline("deno task start")}
    `);
  }

  buildContext.graph?.free();

  return finalBuildResult;
}

export function assertBuildOptions(options: BuildOptions) {
  try {
    /**
     * Assert that we are provided a browserEntrypoint
     */
    assert(
      options.browserEntrypoint,
      `No "browserEntrypoint" was provided, received "${options.browserEntrypoint}"`,
    );

    /**
     * Assert that we are provided a serverEntrypoint
     */
    assert(
      options.serverEntrypoint,
      `No "serverEntrypoint" was provided, received "${options.serverEntrypoint}"`,
    );

    /**
     * Assert that we are provided a serverEntrypoint
     */
    assert(
      options.output,
      `No "output" was provided, received "${options.output}"`,
    );
  } catch (error) {
    throw new Error(error.message);
  }
}
