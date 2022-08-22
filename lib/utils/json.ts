export async function importJsonModule<T>(specifier: string | URL): Promise<T> {
  specifier = typeof specifier === "string" ? specifier : specifier.toString();

  const { default: moduleDefault } = await import(specifier, {
    assert: { type: "json" },
  });

  return moduleDefault as T;
}

// deno-lint-ignore no-explicit-any
export function writeJsonFile(dest: string | URL, value: any) {
  return Deno.writeTextFile(
    dest,
    JSON.stringify(value, null, 2),
  );
}
