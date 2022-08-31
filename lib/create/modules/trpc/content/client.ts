export function trpcClientContent() {
	return `
      import { createTRPCReact } from '@trpc/react';
      import type { AppRouter } from './router.ts';
      export const trpc = createTRPCReact<AppRouter>();
   `
}
