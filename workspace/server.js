import ultra from "../server.ts";
import requestHandler from "../src/server/middleware/requestHandler.ts";

const server = ultra();

server.use(async (context, next) => {
  console.log(`<-- ${context.request.method} ${context.request.url}`);
  await next();
  console.log(
    `--> ${context.request.method} ${context.request.url} ${context.response.status}`,
  );
});

server.use(await requestHandler());

server.start();
