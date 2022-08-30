import { walk } from "https://deno.land/std@0.153.0/fs/mod.ts";
import { globToRegExp } from "https://deno.land/std@0.153.0/path/glob.ts";

/**
 * This tool will update deno.land import strings in readme's and importMaps
 * to use the new version specified.
 *
 * It will also update the version.ts with the new version.
 */

export const DENOLAND_REGEX = /\/\/deno\.land\/x\/ultra@v[\w\.\-]+\//;

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
        DENOLAND_REGEX,
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
        content.replace(DENOLAND_REGEX, newDenoLandVersion),
      );
    }

    /**
     * Set the new version
     */
    console.log("Updating version.ts");
    await Deno.writeTextFile(
      "./version.ts",
      `/* Do not set this manually, run tools/patch.ts if releasing a new version */\nexport const VERSION = "${version}";`,
    );
  }
}
