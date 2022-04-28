import { Application, Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { ultraHandler } from "../src/oak/handler.ts";

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

app.addEventListener("listen", ({ port }) => {
  console.log(`Ultra running via Oak at http://localhost:${port}`);
}, { once: true });

await app.listen({ port });
