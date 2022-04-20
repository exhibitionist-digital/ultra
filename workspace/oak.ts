import { Application, Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { ultraHandler } from "../src/oak/handler.ts";

const port = 8000;

const app = new Application();
const router = new Router();

router.get("/custom-route", (context) => {
  context.response.body = "#1";
});

app.use(router.routes());
app.use(router.allowedMethods());

// ULTRA middleware
// needs to go AFTER your custom routes
// it acts as the final catch all when no
// other route matches
app.use(ultraHandler);

console.log(`Ultra running on http://localhost:${port}`);
await app.listen({ port });
