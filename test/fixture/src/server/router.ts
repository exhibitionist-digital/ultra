import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

const getPostInput = z.object({ id: z.number() });
const getPostOutput = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

const postRouter = t.router({
  get: t.procedure
    .input(getPostInput)
    .output(getPostOutput).query(({ input }) =>
      fetch(`https://jsonplaceholder.typicode.com/todos/${input.id}`).then(
        (response) => response.json(),
      )
    ),
});

export const appRouter = t.router({
  hello: t.procedure.query(() => "world"),
  post: postRouter,
});

export type AppRouter = typeof appRouter;
