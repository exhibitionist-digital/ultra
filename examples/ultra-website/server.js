import ultra, { app, router } from "https://deno.land/x/ultra/mod.js";
import { join } from "https://deno.land/std/path/mod.ts";

router.get("/markdown", async (context) => {
  let md = await grabFileAndReturnMarkdown("content.md");
  context.response.body = {
    content: md.content,
  };
});

await ultra({
  importmap: await Deno.readTextFile("importmap.json"),
});

// syntax highlight markdown
const grabFileAndReturnMarkdown = async (file) => {
  let md = await Deno.readTextFileSync(join(Deno.cwd(), file));
  md = await fetch("https://markdown-syntax.vercel.app/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ markdown: md }),
  });
  return await md.json();
};
