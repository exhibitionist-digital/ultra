import { Config, ImportMap } from "./types.ts";
import { resolveFileUrl } from "./resolver.ts";

const CONFIG_ENV = Deno.env.get("config");
const IMPORT_MAP_ENV = Deno.env.get("importMap");

export async function resolveConfig(cwd: string): Promise<Config> {
  const configPath = resolveFileUrl(cwd, CONFIG_ENV || "./deno.json");
  const config = JSON.parse(await Deno.readTextFile(configPath));

  return config;
}

export async function resolveImportMap(
  cwd: string,
  config?: Config,
): Promise<ImportMap> {
  const importMapPath = resolveFileUrl(
    cwd,
    IMPORT_MAP_ENV || config?.importMap ||
      "./importMap.json",
  );

  const importMap = (await import(String(importMapPath), {
    assert: { type: "json" },
  })).default;

  return importMap;
}
