import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "../server/router.ts";

export const trpc = createTRPCReact<AppRouter>();
