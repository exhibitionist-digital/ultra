// IMPORTS

import outdent from "https://deno.land/x/outdent@v0.8.0/mod.ts";
import { Config, Libraries } from "ultra/lib/create/common/config.ts";
import { ask, confirm } from "ultra/lib/create/common/ask.ts";
import { createUltraApp } from "ultra/lib/create/common/createUltraApp.ts";

// INIT

console.log(`
█▀▀ █▀█ █▀▀ ▄▀█ ▀█▀ █▀▀   █░█ █░░ ▀█▀ █▀█ ▄▀█   ▄▀█ █▀█ █▀█
█▄▄ █▀▄ ██▄ █▀█ ░█░ ██▄   █▄█ █▄▄ ░█░ █▀▄ █▀█   █▀█ █▀▀ █▀▀
`);
console.log(outdent`
    Welcome to Ultra\n
    Let's get you setup with your new Ultra project.\n
`);

const projectName = (await ask<string>("What is the name of your project?")) ||
  "my-ultra-app";

const useTypescript = await confirm("Do you want to use TypeScript?");

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
  "Which css/style library do you want to use?\n(0) None\n(1) Twind\n(2) Stitches\n",
  ["none", "twind", "stitches"],
);

const routingLibrary = await ask<Libraries>(
  "Which routing library do you want to use?\n(0) None\n(1) React Router\n(2) Wouter\n",
  ["none", "react-router", "wouter"],
);

const headLibrary = await ask<Libraries>(
  "Which head management library do you want to use?\n(0) None\n(1) React Helmet\n",
  ["none", "react-helmet-async"],
);

const queryLibrary = await ask<Libraries>(
  "Which query library do you want to use?\n(0) None\n(1) React Query\n",
  ["none", "react-query"],
);

let useTrpc = false
if(useTypescript){
  useTrpc = await confirm("Do you want to use tRPC?");
}

// CONFIG GENERATION

function parseImports() {
  const imports = [
    styleLibrary,
    routingLibrary,
    headLibrary,
    queryLibrary,
    useTrpc ? "trpc" : "none",
    useTrpc ? "react-query" : 'none'
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
