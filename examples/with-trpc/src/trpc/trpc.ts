import { createTRPCReact } from "@trpc/react";
import { AppRouter } from "../server/router.ts";

export const trpc = createTRPCReact<AppRouter>();
