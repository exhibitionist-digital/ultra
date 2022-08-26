import {
  brightBlue,
  deepMerge,
  fromFileUrl,
  green,
  join,
  outdent,
  relative,
  resolve,
  underline,
} from "./lib/build/deps.ts";
import {
  Builder,
  BuilderOptions,
} from "https://deno.land/x/mesozoic@v1.0.0-alpha.9/mod.ts";
import type { BuildOptions, BuildPlugin } from "./lib/build/types.ts";

/**
 * Re-export these types as convenience to build plugin authors
 */
export type { BuildPlugin };

const defaultOptions: Omit<
  BuildOptions,
  "browserEntrypoint" | "serverEntrypoint" | "plugin"
> = {
  output: ".ultra",
  compiler: {
    minify: true,
    sourceMaps: false,
  },
  exclude: [
    ".git",
    join("**", ".DS_Store"),
  ],
};

export default async function build(
  options: Partial<BuildOptions>,
) {
  const resolvedOptions = deepMerge<BuildOptions>(defaultOptions, options);
  const root = Deno.cwd();
  const output = resolvedOptions.output
    ? resolve(root, resolvedOptions.output)
    : resolve(root, ".ultra");

  function makeRelative(path: string) {
    return relative(
      root,
      fromFileUrl(path),
    );
  }

  const mainModule = makeRelative(Deno.mainModule);
  const browserEntrypoint = makeRelative(resolvedOptions.browserEntrypoint);
  const serverEntrypoint = makeRelative(resolvedOptions.serverEntrypoint);

  const entrypoints = [
    `./${serverEntrypoint}`,
    `./${browserEntrypoint}`,
  ];

  const exclude = [
    `./${mainModule}`,
    ...(resolvedOptions.exclude || []),
  ];

  const hashable = [
    "./src/**/*.+(ts|tsx|js|jsx|css)",
    "./public/**/*.+(css|ico|jpg|png|svg|gif|otf|ttf|woff)",
    `./${browserEntrypoint}`,
  ];

  const compilable = [
    "./**/*.+(ts|tsx|js|jsx)",
  ];

  const builderOptions: BuilderOptions = {
    name: "ultra",
    logLevel: "INFO",
  };

  const builder = new Builder({
    root,
    output,
    exclude,
    entrypoints,
    hashable,
    compilable,
    compiler: {
      minify: true,
    },
  }, builderOptions);

  /**
   * Clean the output directory
   */
  await builder.cleanOutput();

  /**
   * Gather all sources from root
   */
  const sources = await builder.gatherSources();
  const entrypointSources = sources.filter((source) =>
    builder.isEntrypoint(source)
  );

  /**
   * Copy sources to output
   */
  const buildSources = await builder.copySources(sources);

  const configSource = buildSources.find((source) =>
    source.relativePath() === "./deno.json"
  );

  if (configSource) {
    const config = JSON.parse(await configSource.read());
    config.compilerOptions.jsx = "react-jsx";
    await configSource.write(JSON.stringify(config, null, 2));
  }

  /**
   * Vendor the dependencies of the entrypoints
   */
  await builder.vendorSources(entrypointSources);

  /**
   * Execute the build
   */
  await builder.build(buildSources);

  // deno-fmt-ignore
  console.log(outdent`\n
    You can now deploy the "${brightBlue(output)}" output directory to a platform of your choice.
    Instructions for common deployment platforms can be found at ${green('https://ultrajs.dev/docs#deploying')}.\n
    Alternatively, you can cd into "${brightBlue(output)}" and run: ${underline("deno task start")}
  `);
}
