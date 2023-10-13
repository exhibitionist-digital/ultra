import { assertEquals } from "https://deno.land/std@0.176.0/testing/asserts.ts";
import { renderToStream } from "../../lib/render.ts";

Deno.test("renderToStream string", async () => {
  const App = () => {
    return (
      "Hi"
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
    text.includes('Hi'),
    true,
  );
});

Deno.test("renderToStream div", async () => {
  const App = () => {
    return (
      <div>Hi</div>
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
    text.includes('Hi'),
    true,
  );
});


Deno.test("renderToStream body", async () => {
  const App = () => {
    return (
      <body>
        <div>Hi</div>
      </body>
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
    text.includes('Hi'),
    true,
  );
});

Deno.test("renderToStream html without head", async () => {
  const App = () => {
    return (
      <html>
        <body>
          <div>Hi</div>
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
    text.includes('Hi'),
    true,
  );
});


Deno.test("renderToStream html with empty head", async () => {
  const App = () => {
    return (
      <html>
        <head></head>
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
    text.includes('Hi'),
    false,
  );
});

Deno.test("renderToStream html body with empty head", async () => {
  const App = () => {
    return (
      <html>
        <head></head>
        <body>
          <div>Hi</div>
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
    text.includes('Hi'),
    true,
  );
});