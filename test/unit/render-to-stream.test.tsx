import { assertEquals } from "https://deno.land/std@0.176.0/testing/asserts.ts";
import { renderToStream } from "../../lib/render.ts";

Deno.test("renderToStream", async () => {
  const App = () => {
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
      assetManifest: new Map()
    },
  );

  const response = new Response(stream);
  const text = await response.text();

  assertEquals(
    text.includes('Hello World'),
    true,
  );
});
