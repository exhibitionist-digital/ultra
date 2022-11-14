export function trpcClientContent() {
  return `
import { createTRPCReact } from '@trpc/react';
import type { AppRouter } from './router.ts';
export const trpc = createTRPCReact<AppRouter>();
   `;
}

export function trpcRouterContent() {
  return `
   import { initTRPC } from '@trpc/server';
   import { z } from 'zod';

   const t = initTRPC.create();

   export const appRouter = t.router({
      hello: t.procedure.input(z.string()).query(({ input }) => {
        return 'hello' + input;
      }),
    });
    
    export type AppRouter = typeof appRouter;
   `;
}
