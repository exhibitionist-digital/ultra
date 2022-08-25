import * as logger from "https://deno.land/std@0.153.0/log/mod.ts";

await logger.setup({
  handlers: {
    console: new logger.handlers.ConsoleHandler("DEBUG"),
  },
  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});

export const log = logger.getLogger();
