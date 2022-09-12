import { assertEquals } from "https://deno.land/std@0.155.0/testing/asserts.ts";
import { renderToStream } from "../../lib/render.ts";
import useAsset from "../../hooks/use-asset.js";

Deno.test("useAsset hook", async () => {
  const App = () => {
    return (
      <html>
        <head>
          <title>Testing</title>
          <link rel="shortcut icon" href={useAsset("./favicon.ico")} />
        </head>
        <body>
          <div>Hello World</div>
        </body>
      </html>
    );
  };

  const assetManifest = new Map([[
    "./favicon.ico",
    "./favicon.1234567890.ico",
  ]]);

  const stream = await renderToStream(
    <App />,
    undefined,
    {
      baseUrl: "/",
      importMap: { imports: {} },
      assetManifest,
    },
  );

  const response = new Response(stream);
  const text = await response.text();

  assertEquals(
    text.includes(
      '<link rel="shortcut icon" href="./favicon.1234567890.ico"/>',
    ),
    true,
  );
});
