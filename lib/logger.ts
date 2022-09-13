import { crayon, log as logging, sprintf } from "./deps.ts";

function gradient(string: string) {
  const chars: string[] = string.split("");

  for (const [index, char] of chars.entries()) {
    chars[index] = crayon.hsl(305 - (7 * index), 100, 70)(char);
  }

  return chars.join("");
}

function formatLevel(level: logging.LevelName) {
  switch (level) {
    case "INFO":
      return crayon.bold.blue(level);

    case "DEBUG":
      return crayon.bold.magenta(level);

    case "WARNING":
      return crayon.bold.yellow(level);

    case "ERROR":
      return crayon.bold.red(level);

    case "CRITICAL":
      return crayon.bgRed.black.bold(level);

    default:
      return level;
  }
}

export class Logger extends logging.Logger {
  /**
   * @param levelName
   */
  constructor(levelName: logging.LevelName) {
    const name = "ultra";
    const loggerName = gradient(`[ultra]`);

    super(name, levelName, {
      handlers: [
        new logging.handlers.ConsoleHandler("DEBUG", {
          formatter(record) {
            const level = formatLevel(record.levelName as logging.LevelName);
            return sprintf(
              "%s - %s %s",
              loggerName,
              level,
              record.msg,
            );
          },
        }),
      ],
    });
  }

  success(message: string) {
    return this.info(crayon.green(`✔ ${message}`));
  }
}

export const log = new Logger(
  (Deno.env.get("ULTRA_LOG_LEVEL") as logging.LevelName) || "INFO",
);
