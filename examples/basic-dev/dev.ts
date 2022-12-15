import { createDev } from "../../dev.ts";

const dev = createDev();
await dev(import.meta.resolve("./server.tsx"));
