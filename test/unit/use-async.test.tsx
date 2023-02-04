import { assertEquals } from "https://deno.land/std@0.173.0/testing/asserts.ts";
import { renderToStream } from "../../lib/render.ts";
import useAsync from "../../hooks/use-async.js";

Deno.test("useAsync hook", async () => {
  const App = () => {
    useAsync(() =>
      new Promise((resolve) => {
        setTimeout(() => resolve("two"), 100);
      })
    );
    useAsync(() => Promise.resolve("one"));

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
    text.includes(
      '<script id="ultra-async-data-stream-:R0H1:" type="application/json">"one"</script>',
    ),
    true,
  );
});
