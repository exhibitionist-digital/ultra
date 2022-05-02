import createRequestHandlerMiddleware from "../src/server/middleware/createRequestHandlerMiddleware.ts";
import ultra from "../server.ts";

const server = ultra();

server.use(async (context, next) => {
  console.log(`<-- ${context.request.method} ${context.request.url}`);
  await next();
  console.log(
    `--> ${context.request.method} ${context.request.url} ${context.response.status}`,
  );
});

server.use(await createRequestHandlerMiddleware());

server.start();
