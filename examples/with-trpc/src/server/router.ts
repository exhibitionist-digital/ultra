import { initTRPC } from "@trpc/server";
import { z } from "zod";

const posts = [
  { name: "First Post" },
  { name: "Second Post" },
  { name: "Third Post" },
];

const t = initTRPC.create();

const postRouter = t.router({
  get: t.procedure.query(() => posts),
  create: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      posts.push(input);
      return input;
    }),
});

export const appRouter = t.router({
  hello: t.procedure.query(() => "world"),
  post: postRouter,
});

export type AppRouter = typeof appRouter;
