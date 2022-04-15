import { transformSource } from "../src/transform.ts";
import { assertEquals } from "./deps.ts";

Deno.test("transformSource", async (t) => {
  const importMap = {
    imports: {
      "react": "https://esm.sh/react",
    },
  };

  const sourceUrl = new URL(import.meta.url);

  await t.step("resolves import specifiers correctly", async () => {
    const code = await transformSource({
      source: `import React from "react";`,
      sourceUrl,
      importMap,
    });

    assertEquals(code, `import React from "https://esm.sh/react";\n`);
  });
});
