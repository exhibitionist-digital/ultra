import { emptyDir, fromFileUrl, toFileUrl, wait } from "./lib/build/deps.ts";
import { compileSources } from "./lib/build/compileSources.ts";
import { copySource } from "./lib/build/copySource.ts";
import { createGraph } from "./lib/build/createGraph.ts";
import { patchDenoConfig } from "./lib/build/patchDenoConfig.ts";
import { ResolvedPaths, resolvePaths } from "./lib/build/resolvePaths.ts";
import { vendorDependencies } from "./lib/build/vendorDependencies.ts";
import { DenoConfig, ImportMap } from "./lib/types.ts";
import { assert } from "./lib/deps.ts";
import { toUltraUrl } from "./lib/utils/url.ts";
import { writeJsonFile } from "./lib/utils/json.ts";
import { cleanup } from "./lib/build/cleanup.ts";

type BuildOptions = {
  /**
   * The browser entrypoint. This is what initially gets sent with the server
   * rendered HTML markup. This should be what hydrates your React application.
   */
  browserEntrypoint: string;
  /**
   * The server entrypoint. This should be what handles your SSR and routing.
   */
  serverEntrypoint: string;
  /**
   * The output directory for built files.
   */
  output?: string;
  /**
   * Force reload of dependencies when vendoring.
   */
  reload?: boolean;
  /**
   * Output source maps for compiled sources.
   */
  sourceMaps?: boolean;
};

type BuildResult = {
  options: BuildOptions;
  denoConfig: DenoConfig;
  paths: ResolvedPaths;
  importMap: ImportMap;
};

const defaultOptions = {
  output: ".ultra",
  reload: false,
  sourceMaps: false,
};

export default async function build(
  options: BuildOptions,
): Promise<BuildResult> {
  const resolvedOptions = {
    ...defaultOptions,
    ...options,
  };

  await assertBuildOptions(resolvedOptions);

  const { browserEntrypoint, serverEntrypoint, output, sourceMaps, reload } =
    resolvedOptions as Required<BuildOptions>;

  const spinner = wait("Building").start();

  /**
   * Resolve paths for build inputs/outputs
   */
  const paths = resolvePaths(output, {
    browserEntrypoint,
    serverEntrypoint,
  });

  const { rootDir, outputDir } = paths;

  /**
   * Prepare the build result
   */
  const buildResult: Partial<BuildResult> = {
    options: resolvedOptions,
    paths,
  };

  spinner.text = `Cleaning output directory: ${outputDir}`;
  await emptyDir(outputDir);

  /**
   * Copy everything from rootDir into outputDir
   */
  spinner.text = `Copying source from: ${rootDir} to ${outputDir}`;
  await copySource(rootDir, outputDir);

  /**
   * Build a module graph from the provided entry points
   */
  spinner.text = "Building module graph";
  const graph = await createGraph(paths);

  /**
   * Compile the sources found in the module graph
   */
  spinner.text = "Compiling and minifying sources";
  const compiled = await compileSources(graph, { sourceMaps, hash: true });

  /**
   * Vendor dependencies
   */
  spinner.text = "Vendoring dependencies";
  const importMap = await vendorDependencies(
    outputDir,
    [
      paths.output.browser,
      paths.entrypoint.server,
      ...Array.from(compiled.values()),
      import.meta.resolve("./server.ts"),
    ],
    {
      reload,
    },
  );

  /**
   * Insert hashed source files into the importMap
   */
  for (const module of compiled.entries()) {
    const specifier = fromFileUrl(
      toUltraUrl(outputDir, module[0], "production"),
    );
    const resolved = fromFileUrl(
      toUltraUrl(outputDir, toFileUrl(module[1]).href, "production"),
    );
    importMap.imports[specifier] = resolved;
  }

  await writeJsonFile(
    paths.resolveOutputFileUrl("importMap.production.json"),
    importMap,
  );

  /**
   * Patch deno.json with required options
   */
  const denoConfig = await patchDenoConfig(paths);

  /**
   * Cleanup build output
   */
  await cleanup(paths);

  buildResult.importMap = importMap;
  buildResult.denoConfig = denoConfig;

  spinner.succeed("Build complete");

  console.log(`
  You can now deploy the "${output}" output directory to a platform of your choice.
  Instructions for common deployment platforms can be found at https://ultrajs.dev/docs#deploying.
  Alternatively, you can cd into "${output}" and run: deno task start
`);

  return buildResult as BuildResult;
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
