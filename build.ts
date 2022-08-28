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
import { Builder } from "https://deno.land/x/mesozoic@v1.0.0-alpha.15/mod.ts";
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

  const builder = new Builder({
    root,
    output,
    name: "ultra",
    importMap: "./importMap.json",
    logLevel: "INFO",
    compiler: {
      minify: true,
      sourceMaps: false,
    },
  });

  builder.setEntrypoints({
    [browserEntrypoint]: {
      vendorOutputDir: "browser",
      target: "browser",
    },
    [serverEntrypoint]: {
      vendorOutputDir: "server",
      target: "deno",
    },
  });

  builder.setExcluded([
    mainModule,
    ...(resolvedOptions.exclude || []),
  ]);

  builder.setHashed([
    "./src/**/*.+(ts|tsx|js|jsx|css)",
    "./public/**/*.+(css|ico|jpg|png|svg|gif|otf|ttf|woff)",
    browserEntrypoint,
  ]);

  builder.setCompiled([
    "./**/*.+(ts|tsx|js|jsx)",
  ]);

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
