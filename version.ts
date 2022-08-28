import { walk } from "https://deno.land/std@0.153.0/fs/mod.ts";
import { globToRegExp } from "https://deno.land/std@0.153.0/path/glob.ts";

export const VERSION = "2.0.0-alpha.12";
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

if (import.meta.main) {
  const version = prompt("Whats the new version?");
  if (version) {
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
}
