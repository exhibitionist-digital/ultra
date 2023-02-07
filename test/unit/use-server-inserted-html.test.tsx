import { assertEquals } from "https://deno.land/std@0.176.0/testing/asserts.ts";
import { renderToStream } from "../../lib/render.ts";
import useServerInsertedHTML from "../../hooks/use-server-inserted-html.js";

Deno.test("useServerInsertedHTML hook", async () => {
  const App = () => {
    useServerInsertedHTML(() => {
      return <div>Testing useServerInsertedHTML</div>;
    });

    return (
      <html>
        <head>
          <title>Testing</title>
        </head>
        <body>
          <div>Hello World</div>
        </body>
      </html>
    );
  };

  const stream = await renderToStream(
    <App />,
    undefined,
    {
      baseUrl: "/",
      importMap: { imports: {} },
      assetManifest: undefined,
    },
  );

  const response = new Response(stream);
  const text = await response.text();

  assertEquals(
    text.includes("Testing useServerInsertedHTML"),
    true,
  );
});
