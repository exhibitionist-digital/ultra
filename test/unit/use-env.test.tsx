import { assertEquals } from "https://deno.land/std@0.176.0/testing/asserts.ts";
import useEnv from "../../hooks/use-env.js";
import { renderToStream } from "../../lib/render.ts";

Deno.test("useEnv hook", async () => {
  let value;

  Deno.env.set("ULTRA_MODE", "foo");

  const App = () => {
    value = useEnv("ULTRA_MODE");
    return (
      <html>
        <head>
          <title>useEnv</title>
        </head>
        <body>
          <div>{value}</div>
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
      assetManifest: new Map(),
    },
  );

  const response = new Response(stream);
  const text = await response.text();

  assertEquals(
    text.includes("foo"),
    true,
  );

  assertEquals(
    text.includes("globalThis.__ULTRA_ENV"),
    true,
  );
});
