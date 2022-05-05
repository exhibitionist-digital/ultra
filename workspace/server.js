import { Application, Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { requestHandler } from "../src/server.ts";

const port = 8000;
const app = new Application();
const router = new Router();

app.use(async (context, next) => {
  console.log(`<--     ${context.request.method} ${context.request.url}`);
  await next();
  console.log(
    `--> ${context.response.status} ${context.request.method} ${context.request.url}`,
  );
});

router.get("/custom-route", (context) => {
  context.response.body = "Oak custom route!";
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(requestHandler);

console.log(`Ultra running on http://localhost:${port}`);
await app.listen({ port });
