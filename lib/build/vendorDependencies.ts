import { ImportMap } from "../types.ts";
import { importJsonModule, writeJsonFile } from "../utils/json.ts";
import { importMapRelative } from "../utils/import-map.ts";
import { nonNullable } from "../utils/non-nullable.ts";
import { resolve, toFileUrl } from "./deps.ts";

type VendorDependenciesOptions = {
  reload?: boolean;
};

/**
 * Runs the Deno CLI "vendor" command and patches the output
 * vendor/import_map.json so that the specifier urls are
 * relative to "./vendor"
 */
export async function vendorDependencies(
  dest: string,
  paths: string[],
  options: VendorDependenciesOptions,
) {
  const cmd = [
    Deno.execPath(),
    "vendor",
    "--force",
    options.reload ? "--reload" : undefined,
    ...paths,
  ].filter(nonNullable);

  const vendor = Deno.run({
    cwd: dest,
    cmd: cmd,
    stdout: "piped",
    stderr: "piped",
  });

  const { code } = await vendor.status();
  const rawError = await vendor.stderrOutput();

  if (code === 0) {
    const vendorPath = "./vendor/";
    const vendorImportMapPath = toFileUrl(resolve(
      dest,
      vendorPath,
      "import_map.json",
    ));

    const builtImportMapPath = resolve(
      dest,
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
