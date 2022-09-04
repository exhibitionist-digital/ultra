// Update the fixture importMap to use the latest commit
const importMap = JSON.parse(
  Deno.readTextFileSync("./test/fixture/importMap.json"),
);

const githubSha = Deno.env.get("GITHUB_SHA");

if (importMap.imports && githubSha) {
  importMap.imports["ultra/"] =
    `https://raw.githubusercontent.com/exhibitionist-digital/ultra/${githubSha}/`;
}

await Deno.writeTextFile(
  "./test/fixture/importMap.json",
  JSON.stringify(importMap, null, 2),
);
console.log(importMap);
