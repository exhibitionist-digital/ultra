import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.155.0/testing/asserts.ts";
import { renderToStream } from "../../lib/render.ts";
import useAsset from "../../hooks/use-asset.js";

Deno.test("useAsset hook", async () => {
  const App = () => {
    return (
      <html>
        <head>
          <title>Testing</title>
          <link rel="shortcut icon" href={useAsset("/favicon.ico")} />
          <link rel="stylesheet" href={useAsset("/style.css")} />
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

  // Test for an asset not available in the assetManifest
  assertEquals(
    text.includes('<link rel="stylesheet" href="./style.css"/>'),
    true,
  );

  // Test for an asset defined in the assetManifest
  assertEquals(
    text.includes(
      '<link rel="shortcut icon" href="./favicon.1234567890.ico"/>',
    ),
    true,
  );
});

Deno.test("useAsset should throw with no path provided", () => {
  assertThrows(() => useAsset());
});
