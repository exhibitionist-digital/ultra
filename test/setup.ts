// Update the fixture importMap to use the latest commit
const importMap = JSON.parse(
  Deno.readTextFileSync("./test/fixture/importMap.json"),
);

const githubSha = Deno.env.get("GITHUB_SHA");

if (importMap.imports && githubSha) {
  /**
   * Set ultra to the latest commit
   */
  importMap.imports["ultra/"] =
    `https://denopkg.com/exhibitionist-digital/ultra@${githubSha}/`;

  /**
   * Write it out
   */
  await Deno.writeTextFile(
    "./test/fixture/importMap.json",
    JSON.stringify(importMap, null, 2),
  );
}
