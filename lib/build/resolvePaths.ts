import { fromFileUrl, join, relative, toFileUrl } from "./deps.ts";

type ResolvePathsOptions = {
  browserEntrypoint: string;
  serverEntrypoint: string;
};

export type ResolvedPaths = ReturnType<typeof resolvePaths>;

export function resolvePaths(
  dest: string,
  options: ResolvePathsOptions,
) {
  const rootDir = Deno.cwd();
  const outputDir = join(rootDir, dest);

  const browserEntrypoint = relative(
    rootDir,
    fromFileUrl(options.browserEntrypoint),
  );

  const serverEntrypoint = relative(
    rootDir,
    fromFileUrl(options.serverEntrypoint),
  );

  return {
    rootDir,
    outputDir,
    entrypoint: {
      browser: browserEntrypoint,
      server: serverEntrypoint,
    },
    output: {
      browser: join(outputDir, browserEntrypoint),
      server: join(outputDir, serverEntrypoint),
    },
    resolveOutputFileUrl(path: string) {
      return toFileUrl(join(outputDir, path));
    },
  } as const;
}