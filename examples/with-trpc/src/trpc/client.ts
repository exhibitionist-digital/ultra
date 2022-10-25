import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { trpc } from "./trpc.ts";

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});
