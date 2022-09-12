import { assertEquals } from "https://deno.land/std@0.155.0/testing/asserts.ts";
import { renderToStream } from "../../lib/render.ts";
import useAsync from "../../hooks/use-async.js";

Deno.test("useAsync hook", async () => {
  const promise = fetch(
    "https://jsonplaceholder.typicode.com/todos/1",
  )
    .then((response) => response.json());

  const App = () => {
    const data = useAsync(promise);
    console.log(data);
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
      importMap: { imports: {} },
      assetManifest: undefined,
    },
  );

  const response = new Response(stream);
  const text = await response.text();
  assertEquals(
    text.includes(
      '<script id="data-stream-:R0:" type="application/json">{"userId":1,"id":1,"title":"delectus aut autem","completed":false}</script>',
    ),
    true,
  );
});
