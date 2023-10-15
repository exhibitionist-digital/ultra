# Ultra 3

> [!IMPORTANT]\
> This is a wip branch, things will move around and change a bit.

- Remove Hono from Ultra server, and allow a request handler which can be used
  with Deno.serve or Hono (or others)
- This will allow configuration of your server/middleware outside of Ultra
- Make the React renderer and compiler external (+ optional)
- Investigate vendoring esm.sh deps in `dev`, and other quality of life
  improvements that have landed in esm.sh and deno recently.
  ([vendor](https://deno.com/blog/v1.19#deno-vendor),
  [hmr](https://github.com/denoland/deno/pull/20876),
  [cli](https://esm.sh/#cli))

`./react` is a simple Ultra server working the above bullet points in action. We
are exposing `createRenderHandler` and `createCompilerHandler` which should
allow more custom non-react implementations.

Would be nice to see a simple `./web-components` example. Even if the SSR is
limited.
