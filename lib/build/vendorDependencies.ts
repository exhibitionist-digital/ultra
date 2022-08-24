import type { ImportMap } from "../types.ts";
import { importMapRelative } from "../utils/import-map.ts";
import { importJsonModule, writeJsonFile } from "../utils/json.ts";
import { nonNullable } from "../utils/non-nullable.ts";
import { resolve, toFileUrl } from "./deps.ts";
import type { BuildContext } from "./types.ts";

type VendorDependenciesOptions = {
  reload?: boolean;
};

/**
 * Runs the Deno CLI "vendor" command and patches the output
 * vendor/import_map.json so that the specifier urls are
 * relative to "./vendor"
 */
export async function vendorDependencies(
  context: BuildContext,
  paths: string[],
  options: VendorDependenciesOptions,
) {
  const { outputDir } = context.paths;
  const cmd = [
    Deno.execPath(),
    "vendor",
    "--force",
    options.reload ? "--reload" : undefined,
    ...[context.paths.output.browser, context.paths.output.server, ...paths],
  ].filter(nonNullable);

  const vendor = Deno.run({
    cwd: outputDir,
    cmd: cmd,
    stdout: "piped",
    stderr: "piped",
  });

  const { code } = await vendor.status();
  const rawError = await vendor.stderrOutput();

  if (code === 0) {
    const vendorPath = "./vendor/";
    const vendorImportMapPath = toFileUrl(resolve(
      outputDir,
      vendorPath,
      "import_map.json",
    ));

    const builtImportMapPath = resolve(
      outputDir,
      "./importMap.production.json",
    );

    const vendorImportMap: ImportMap = await importJsonModule(
      vendorImportMapPath,
    );

    const importMap = importMapRelative(vendorImportMap, vendorPath);

    await writeJsonFile(builtImportMapPath, importMap);

    return importMap;
  } else {
    const errorString = new TextDecoder().decode(rawError);
    throw new Error(errorString);
  }
}
