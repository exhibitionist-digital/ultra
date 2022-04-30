import { Application, Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { ultraHandler } from "../src/oak/handler.ts";
import { transformCss } from "../src/transformer/css.ts";
import { isReadableStream, readAllFromReadableStream } from "../src/stream.ts";

const port = 8000;

const app = new Application();
const router = new Router();

router.get("/custom-route", (context) => {
  context.response.body = "Oak custom route!";
});

app.use(router.routes());
app.use(router.allowedMethods());

// ULTRA middleware
// needs to go AFTER your custom routes
// it acts as the final catch all when no
// other route matches
app.use(ultraHandler);

app.use(async ({ request, response }, next) => {
  if (
    request.url.pathname.endsWith(".css") && isReadableStream(response.body)
  ) {
    const source = await readAllFromReadableStream(response.body);
    const transformed = transformCss(source, {
      output: {
        minify: true,
      },
    });
    response.body = new Blob([transformed]);
  }
  await next();
});

console.log(`Ultra running on http://localhost:${port}`);
await app.listen({ port });
