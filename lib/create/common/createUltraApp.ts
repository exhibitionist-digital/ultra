import { Config } from "./config.ts";
import outdent from "https://deno.land/x/outdent@v0.8.0/mod.ts";
import {
  brightBlue,
  underline,
  yellow,
} from "https://deno.land/std@0.173.0/fmt/colors.ts";
import { createFile, fetchFile, fileExtension } from "./io.ts";
import {
  appContent,
  buildContent,
  clientContent,
  denoConfigContent,
  importMapContent,
  serverContent,
  styleContent,
} from "./content/index.ts";
import { twindConfigContent, twindContent } from "../modules/twind.ts";
import {
  stitchesConfigContent,
  stitchesProviderContent,
} from "../modules/stitches.ts";
import { wouterContent } from "../modules/wouter.ts";
import {
  queryClientContent,
  useDehydrateReactQueryContent,
} from "../modules/react_query.ts";
import { trpcClientContent, trpcRouterContent } from "../modules/trpc.ts";
import { gradient } from "./styling.ts";

export async function createUltraApp(config: Config) {
  // Initialize file creation and naming functions
  const create = createFile(config);
  const ext = fileExtension(config);
  const dl = fetchFile(config);

  // Write standard files
  await create("deno.json", denoConfigContent(config));
  await create("importMap.json", importMapContent(config));
  await create(ext("build", false), buildContent(config));
  await create(ext("client", true), clientContent(config));
  await create(ext("server", true), serverContent(config));
  await create(ext("/src/app", true), appContent(config));
  await create("public/style.css", styleContent());
  await dl(
    "/public/favicon.ico",
    "https://raw.githubusercontent.com/exhibitionist-digital/ultra/main/examples/basic/public/favicon.ico",
  );
  await dl(
    "/public/robots.txt",
    "https://raw.githubusercontent.com/exhibitionist-digital/ultra/main/examples/basic/public/robots.txt",
  );

  // Write conditional files

  if (config.includes.includes("twind")) {
    await create(ext("src/twind/twind", false), twindContent(config));
    await create(
      ext("src/twind/twind.config", false),
      twindConfigContent(config),
    );
  }

  if (config.includes.includes("stitches")) {
    await create(
      ext("src/stitches/stitches.config", false),
      stitchesConfigContent(config),
    );
    await create(
      ext("src/stitches/StitchesProvider", true),
      stitchesProviderContent(config),
    );
  }

  if (config.includes.includes("wouter")) {
    await create(ext("src/wouter/index", true), wouterContent(config));
  }

  if (config.includes.includes("react-query" || "trpc")) {
    await create(
      ext("src/react-query/query-client", false),
      queryClientContent(),
    );
    await create(
      ext("src/react-query/useDehydrateReactQuery", true),
      useDehydrateReactQueryContent(config),
    );
  }
  if (config.includes.includes("trpc")) {
    await create(ext("src/trpc/client", false), trpcClientContent());
    await create(ext("src/trpc/router", false), trpcRouterContent());
  }

  // Format files
  await Deno.run({ cmd: ["deno", "fmt", `${config.name}/`] }).status();

  // Finish up
  console.log(outdent`
      \nYour new ${gradient("Ultra")} project is ready, you can now cd into "${
    brightBlue(
      config.name,
    )
  }" and run ${underline(yellow("deno task dev"))} to get started!
  `);

  // Exit
  Deno.exit(0);
}
