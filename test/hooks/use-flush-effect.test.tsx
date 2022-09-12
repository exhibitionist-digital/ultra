import { assertEquals } from "https://deno.land/std@0.155.0/testing/asserts.ts";
import { renderToStream } from "../../lib/render.ts";
import useFlushEffect from "../../hooks/use-flush-effects.js";

Deno.test("useFlushEffect hook", async () => {
  const App = () => {
    useFlushEffect(() => {
      return <div>Testing use-flush-effect</div>;
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
    text.includes("Testing use-flush-effect"),
    true,
  );
});
