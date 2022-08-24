import {
  brightBlue,
  emptyDir,
  fromFileUrl,
  green,
  outdent,
  relative,
  sprintf,
  toFileUrl,
  underline,
  wait,
} from "./lib/build/deps.ts";
import { compileSources } from "./lib/build/compileSources.ts";
import { copySource } from "./lib/build/copySource.ts";
import { createGraph } from "./lib/build/createGraph.ts";
import { patchDenoConfig } from "./lib/build/patchDenoConfig.ts";
import { resolvePaths } from "./lib/build/resolvePaths.ts";
import { vendorDependencies } from "./lib/build/vendorDependencies.ts";
import { assert } from "./lib/deps.ts";
import { toUltraUrl } from "./lib/utils/url.ts";
import { writeJsonFile } from "./lib/utils/json.ts";
import { cleanup } from "./lib/build/cleanup.ts";
import type {
  BuildOptions,
  BuildPlugin,
  BuildResult,
} from "./lib/build/types.ts";
import { createBuildContext } from "./lib/build/context.ts";
import { assetManifest } from "./lib/build/assetManifest.ts";

/**
 * Re-export these types as convenience to build plugin authors
 */
export type { BuildPlugin };

const defaultOptions = {
  output: ".ultra",
  reload: false,
  sourceMaps: false,
};

const cwd = Deno.cwd();
const BUILD_COMPLETE_MESSAGE = "Build complete!";

function cwdRelative(path: string) {
  return relative(cwd, path);
}

export default async function build(
  options: BuildOptions,
): Promise<BuildResult> {
  const resolvedOptions = {
    ...defaultOptions,
    ...options,
  };

  await assertBuildOptions(resolvedOptions);

  const {
    browserEntrypoint,
    serverEntrypoint,
    output,
    sourceMaps,
    reload,
    plugin,
  } = resolvedOptions as Required<BuildOptions>;

  const spinner = wait({ text: "Building", stream: Deno.stdout }).start();

  /**
   * Resolve paths for build inputs/outputs
   */
  const paths = resolvePaths(output, {
    browserEntrypoint,
    serverEntrypoint,
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
  buildContext.graph = await createGraph(buildContext);

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
  spinner.text = "Vendoring dependencies";
  const importMap = await vendorDependencies(buildContext, [
    ...Array.from(compiled.values()),
    import.meta.resolve("./server.ts"),
  ], {
    reload,
  });

  /**
   * Insert hashed source files into the importMap
   */
  for (const module of compiled.entries()) {
    const specifier = fromFileUrl(
      toUltraUrl(buildContext.paths.outputDir, module[0], "production"),
    );
    const resolved = fromFileUrl(
      toUltraUrl(
        buildContext.paths.outputDir,
        toFileUrl(module[1]).href,
        "production",
      ),
    );
    importMap.imports[specifier] = resolved;
  }

  await writeJsonFile(
    paths.resolveOutputFileUrl("importMap.production.json"),
    importMap,
  );

  /**
   * Create the asset manifest
   */
  const assets = await assetManifest(buildContext);

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
    importMap,
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
