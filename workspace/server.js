import ultra from "../server.ts";

const server = await ultra();

server.use(async (context, next) => {
  console.log(`<-- ${context.request.method} ${context.request.url}`);
  await next();
  console.log(
    `--> ${context.request.method} ${context.request.url} ${context.response.status}`,
  );
});

server.start();
