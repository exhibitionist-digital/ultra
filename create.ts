// IMPORTS
import { Config, Libraries } from "./lib/create/common/config.ts";
import { ask, confirm } from "./lib/create/common/ask.ts";
import { createUltraApp } from "./lib/create/common/createUltraApp.ts";
import { c, gradient } from "./lib/create/common/styling.ts";

//INIT

console.log(gradient(
  `
▄• ▄▌▄▄▌  ▄▄▄▄▄▄▄▄   ▄▄▄· 
█▪██▌██•  •██  ▀▄ █·▐█ ▀█ 
█▌▐█▌██▪   ▐█.▪▐▀▀▄ ▄█▀▀█ 
▐█▄█▌▐█▌▐▌ ▐█▌·▐█•█▌▐█ ▪▐▌
 ▀▀▀ .▀▀▀  ▀▀▀ .▀  ▀ ▀  ▀`,
  .5,
));
console.log(`
\nWelcome to ${gradient("Ultra")}\n
Let's get you setup with your new ${gradient("Ultra")} project.
`);

const projectName =
  (await ask<string>(`\nWhat is the name of your project?`)) ||
  "my-ultra-app";

const useTypescript = await confirm("\nDo you want to use TypeScript?");

// if arguments were provided, use them instead of asking the user

if (Deno.args.length) {
  // CONFIG GENERATION

  const config: Config = {
    ts: useTypescript,
    name: projectName,
    cwd: Deno.cwd(),
    includes: Deno.args as Libraries[],
  };

  // FILE CREATION AND FORMATTING, will exit

  await createUltraApp(config);
}

// or else, continue
const styleLibrary = await ask<Libraries>(
  `\nWhich css/style library do you want to use?\n'${c(0, "(0) None ")} ${
    c(1, "(1) Twind ")
  } ${c(2, "(2) Stitches ")}`,
  ["none", "twind", "stitches"],
);

const routingLibrary = await ask<Libraries>(
  `\nWhich routing library do you want to use?\n${c(0, "(0) None ")} ${
    c(1, "(1) React Router ")
  } ${c(2, "(2) Wouter ")}`,
  ["none", "react-router", "wouter"],
);

const headLibrary = await ask<Libraries>(
  `\nWhich head management library do you want to use?\n${c(0, "(0) None ")} ${
    c(1, "(1) React Helmet")
  }`,
  ["none", "react-helmet-async"],
);

const queryLibrary = await ask<Libraries>(
  `\nWhich query library do you want to use?\n${c(0, "(0) None")} ${
    c(1, "(1) React Query")
  }`,
  ["none", "react-query"],
);


// CONFIG GENERATION

function parseImports() {
  const imports = [
    styleLibrary,
    routingLibrary,
    headLibrary,
    queryLibrary,
  ];
  return imports as Libraries[];
}

const config: Config = {
  ts: useTypescript,
  name: projectName,
  cwd: Deno.cwd(),
  includes: parseImports(),
};

// FILE CREATION AND FORMATTING, will exit
await createUltraApp(config);
