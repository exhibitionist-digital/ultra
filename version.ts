import { walk } from "https://deno.land/std@0.153.0/fs/mod.ts";
import { globToRegExp } from "https://deno.land/std@0.153.0/path/glob.ts";

export const VERSION = "2.0.0-alpha.5";
export const VERSION_REGEX = /\/\/deno\.land\/x\/ultra@v[\w\.\-]+\//;

export const ULTRA_OUTPUT_REGEX = globToRegExp("examples/**/.ultra", {
  extended: true,
  globstar: true,
  caseInsensitive: false,
});

export const IMPORT_MAP_REGEX = globToRegExp("examples/**/importMap.json", {
  extended: true,
  globstar: true,
  caseInsensitive: false,
});

/** `prepublish` will be invoked before publish, return `false` to prevent the publish. */
export async function prepublish(version: string) {
  const newDenoLandVersion = `//deno.land/x/ultra@v${version}/`;

  const readme = await Deno.readTextFile("./README.md");

  console.log("Patching README.md");
  await Deno.writeTextFile(
    "./README.md",
    readme.replace(
      VERSION_REGEX,
      `//deno.land/x/ultra@v${version}/`,
    ),
  );

  console.log("Patching examples importMaps");

  for await (
    const entry of walk("./", {
      match: [IMPORT_MAP_REGEX],
      skip: [ULTRA_OUTPUT_REGEX],
    })
  ) {
    const content = await Deno.readTextFile(entry.path);
    await Deno.writeTextFile(
      entry.path,
      content.replace(VERSION_REGEX, newDenoLandVersion),
    );
  }
}

/** `postpublish` will be invoked after published. */
export function postpublish(version: string) {
  console.log("Upgraded to", version);
}
