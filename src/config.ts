import { join } from "./deps.ts";
import { Config, ImportMap } from "./types.ts";

const cwd = Deno.cwd();

const CONFIG_ENV = Deno.env.get("config");
const IMPORT_MAP_ENV = Deno.env.get("importMap");

export async function resolveConfig(): Promise<Config> {
  const configPath = join(Deno.cwd(), CONFIG_ENV || "./deno.json");
  const config =
    (await import(configPath, { assert: { type: "json" } })).default;

  return config;
}

export async function resolveImportMap(config?: Config): Promise<ImportMap> {
  const importMapPath = join(
    cwd,
    IMPORT_MAP_ENV || config?.importMap ||
      "./importMap.json",
  );

  const importMap = (await import(importMapPath, {
    assert: { type: "json" },
  })).default;

  return importMap;
}
