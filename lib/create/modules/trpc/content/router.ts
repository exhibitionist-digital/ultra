export function trpcRouterContent() {
	return `
      import { initTRPC } from '@trpc/server'
      import { z } from 'zod'

      const t = initTRPC()()

      export const appRouter = t.router({
	      hello: t.procedure.input(z.string().nullish()).query(async ({ input }) => {
		      await new Promise(resolve => setTimeout(resolve, 3000))
		      return 'Hello World!'
	      }),
      })

      export type AppRouter = typeof appRouter
   `
}
