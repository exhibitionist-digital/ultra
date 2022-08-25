import type { ImportMap } from "../types.ts";
import { importMapRelative } from "../utils/import-map.ts";
import { importJsonModule, writeJsonFile } from "../utils/json.ts";
import { nonNullable } from "../utils/non-nullable.ts";
import { join, resolve, SEP, toFileUrl } from "./deps.ts";
import type { BuildContext } from "./types.ts";

type VendorDependenciesOptions = {
  reload?: boolean;
  target: "browser" | "server";
  paths?: string[];
};

/**
 * Runs the Deno CLI "vendor" command and patches the output
 * vendor/import_map.json so that the specifier urls are
 * relative to "./vendor"
 */
export async function vendorDependencies(
  context: BuildContext,
  options: VendorDependenciesOptions,
) {
  const { outputDir } = context.paths;
  const vendorOutputPath = join("vendor", options.target, SEP);

  const cmd = [
    Deno.execPath(),
    "vendor",
    "--force",
    "--output",
    vendorOutputPath,
    options.reload ? "--reload" : undefined,
  ].filter(nonNullable);

  if (options.target === "browser") {
    cmd.push(context.paths.output.browser, ...options.paths || []);
  } else {
    cmd.push(context.paths.output.server);
  }

  const vendor = Deno.run({
    cwd: outputDir,
    cmd: cmd,
    stdout: "piped",
    stderr: "piped",
  });

  const { code } = await vendor.status();
  const rawError = await vendor.stderrOutput();

  if (code === 0) {
    const vendorImportMapPath = toFileUrl(resolve(
      outputDir,
      vendorOutputPath,
      "import_map.json",
    ));

    const builtImportMapPath = resolve(
      outputDir,
      `./importMap.${options.target}.json`,
    );

    const targetImportMap: ImportMap = await importJsonModule(
      vendorImportMapPath,
    );

    const importMap = importMapRelative(
      targetImportMap,
      `.${SEP}${vendorOutputPath}`,
    );
    await writeJsonFile(builtImportMapPath, importMap);

    return importMap;
  } else {
    const errorString = new TextDecoder().decode(rawError);
    throw new Error(errorString);
  }
}
