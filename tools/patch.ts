import { walk } from "https://deno.land/std@0.176.0/fs/mod.ts";
import {
  increment,
  parse as parseSemver,
  ReleaseType,
} from "https://deno.land/std@0.176.0/semver/mod.ts";
import { globToRegExp } from "https://deno.land/std@0.176.0/path/glob.ts";
import { parse } from "https://deno.land/std@0.176.0/flags/mod.ts";
import { assert } from "https://deno.land/std@0.176.0/_util/asserts.ts";

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

const parsedArgs = parse(Deno.args, {
  string: "release",
});

const listFormatter = new Intl.ListFormat("default", {
  style: "short",
  type: "disjunction",
});

async function patchFile(path: string, newVersion: string) {
  console.log(`Patching: ${path}`);
  const content = await Deno.readTextFile(path);
  await Deno.writeTextFile(
    path,
    content.replace(DENOLAND_REGEX, `//deno.land/x/ultra@v${newVersion}/`),
  );
}

if (import.meta.main) {
  const releaseTypes = [
    "pre",
    "major",
    "premajor",
    "minor",
    "preminor",
    "patch",
    "prepatch",
    "prerelease",
  ];
  const release = parsedArgs.release;

  assert(release !== undefined, "Must provide a release type.");
  assert(
    releaseTypes.includes(release),
    `Not a valid release type. Accepted values: ${
      listFormatter.format(releaseTypes)
    }`,
  );

  const { VERSION: currentVersion } = await import("../version.ts");
  const parsedVersion = parseSemver(currentVersion, {
    includePrerelease: true,
  });

  if (!parsedVersion) {
    throw new Error("Failed to parse current version as semver.");
  }

  console.log(`Current version: ${parsedVersion.toString()}`);
  const nextVersion = increment(parsedVersion, release as ReleaseType, {
    includePrerelease: true,
  }, release === "pre" ? "beta" : undefined);

  const version = prompt("Whats the new version?", nextVersion || undefined);

  if (version) {
    await patchFile("./README.md", version);
    await patchFile("./lib/create/common/content/importMap.ts", version);
    await patchFile(
      "./examples/ultra-website/content/docs/create-project.mdx",
      version,
    );

    for await (
      const entry of walk("./", {
        match: [IMPORT_MAP_REGEX],
        skip: [ULTRA_OUTPUT_REGEX],
      })
    ) {
      await patchFile(entry.path, version);
    }

    /**
     * Set the new version
     */
    console.log("Updating version.ts");
    await Deno.writeTextFile(
      "./version.ts",
      `/* Do not set this manually, run tools/patch.ts if releasing a new version */\nexport const VERSION = "${version}";\n`,
    );
  }
}
