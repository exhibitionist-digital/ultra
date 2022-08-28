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
  ImportMap,
} from "https://deno.land/x/mesozoic@v1.0.0-alpha.14/mod.ts";
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
    return `./${
      relative(
        root,
        fromFileUrl(path),
      )
    }`;
  }

  const mainModule = makeRelative(Deno.mainModule);
  const browserEntrypoint = makeRelative(resolvedOptions.browserEntrypoint);
  const serverEntrypoint = makeRelative(resolvedOptions.serverEntrypoint);

  const exclude = [
    mainModule,
    ...(resolvedOptions.exclude || []),
  ];

  const hashable = [
    "./src/**/*.+(ts|tsx|js|jsx|css)",
    "./public/**/*.+(css|ico|jpg|png|svg|gif|otf|ttf|woff)",
    browserEntrypoint,
  ];

  const compilable = [
    "./**/*.+(ts|tsx|js|jsx)",
  ];

  const builderOptions: BuilderOptions = {
    name: "build",
    logLevel: "DEBUG",
  };

  const builder = new Builder({
    root,
    output,
    exclude,
    entrypoints: {
      [browserEntrypoint]: {
        output: "browser",
        target: "browser",
      },
      [serverEntrypoint]: {
        output: "server",
        target: "deno",
      },
    },
    hashable,
    compilable,
    manifest: {
      exclude: [
        "./public/robots.txt",
        "./importMap.json",
        "./deno.json",
      ],
    },
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

  /**
   * Copy sources to output
   */
  const buildSources = await builder.copySources(sources);

  /**
   * Resolve the importMapSource
   */
  const importMapSource = buildSources.find((source) =>
    source.relativePath() === "./importMap.json"
  );

  /**
   * Read the importMap JSON
   */
  const importMap = importMapSource
    ? await importMapSource.readAsJson<ImportMap>()
    : undefined;

  /**
   * Execute the build
   */
  const result = await builder.build(buildSources, importMap);
  console.log(result);

  // /**
  //  * This will hold files we want to generate after
  //  * the main build process has completed.
  //  */
  // const virtualSources = new FileBag();

  // /**
  //  * Find deno.json and patch it
  //  */
  // const configSource = buildSources.find((source) =>
  //   source.relativePath() === "./deno.json"
  // );

  // if (configSource) {
  //   builder.log.info(`Patching ${configSource.relativePath()}`);
  //   const config: DenoConfig = await configSource.readAsJson();

  //   if (config.compilerOptions) {
  //     config.compilerOptions.jsx = "react-jsx";
  //   }

  //   //@ts-ignore fixed upstream
  //   await configSource.writeJson(config, true);
  // }

  // /**
  //  * Execute the build
  //  */
  // const result = await builder.build(buildSources);

  // /**
  //  * Create asset manifest
  //  */
  // const manifest = builder.toManifest(buildSources, "/_ultra/static");

  // const assetManifest = new VirtualFile(
  //   "./asset-manifest.json",
  //   builder.context.root,
  //   JSON.stringify(manifest, null, 2),
  // );

  // virtualSources.add(assetManifest);

  // await builder.copySources(virtualSources);

  // // const assetManifest = new VirtualFile()

  // // console.log(builder.toManifest(buildSources, "/_ultra/static"));

  // deno-fmt-ignore
  console.log(outdent`\n
    You can now deploy the "${brightBlue(output)}" output directory to a platform of your choice.
    Instructions for common deployment platforms can be found at ${green('https://ultrajs.dev/docs#deploying')}.\n
    Alternatively, you can cd into "${brightBlue(output)}" and run: ${underline("deno task start")}
  `);
}
