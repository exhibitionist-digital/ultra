import { Application, Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { unstable_createUltraMiddleware } from "../unstable.ts";
import App from "./src/app.tsx";

const port = 8000;
const app = new Application();

const apiRoutes = new Router({
  prefix: "/api",
});

apiRoutes.get("/posts", (context) => {
  context.response.body = [{
    id: 1,
    title: "Post #1",
  }];
});

app.use(apiRoutes.routes(), apiRoutes.allowedMethods());

// ULTRA middleware
// needs to go AFTER your custom routes
// it acts as the final catch all when no
// other route matches
app.use(await unstable_createUltraMiddleware(App));

console.log(`Ultra running on http://localhost:${port}`);
await app.listen({ port });
