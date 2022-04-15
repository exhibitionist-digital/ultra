import { ImportMapResolver } from "../src/importMapResolver.ts";
import { assertEquals } from "./deps.ts";

Deno.test("importResolver", async (t) => {
  const importMap = {
    imports: {
      "react": "https://esm.sh/react",
      "fmt/": "https://deno.land/std@0.134.0/fmt/",
      "/": "./",
      "./": "./",
      "app.tsx": "./src/app.tsx",
      "#/": "./src/",
    },
  };

  function assertFileHrefEquals(href: string, expected: string) {
    return assertEquals(href, `file://${Deno.cwd()}/${expected}`);
  }

  const baseUrl = new URL(import.meta.url);
  const resolver = new ImportMapResolver(importMap, baseUrl);

  await t.step("simple specifier", () => {
    const react = resolver.resolve("react", new URL(import.meta.url));
    assertEquals(react.resolvedImport.href, "https://esm.sh/react");

    const app = resolver.resolve("app.tsx", new URL(import.meta.url));

    assertFileHrefEquals(
      app.resolvedImport.href,
      "src/app.tsx",
    );
  });

  await t.step("absolute specifier", () => {
    const app = resolver.resolve("/app.tsx", new URL(import.meta.url));
    assertFileHrefEquals(
      app.resolvedImport.href,
      "app.tsx",
    );

    const page = resolver.resolve(
      "#/components/pages/article/view/BlogArticleViewPage.tsx",
      new URL(import.meta.url),
    );

    assertFileHrefEquals(
      page.resolvedImport.href,
      "src/components/pages/article/view/BlogArticleViewPage.tsx",
    );
  });

  await t.step("advanced specifier", () => {
    const colors = resolver.resolve(
      "fmt/colors.ts",
      new URL(import.meta.url),
    );

    assertEquals(
      colors.resolvedImport.href,
      "https://deno.land/std@0.134.0/fmt/colors.ts",
    );
  });
});
