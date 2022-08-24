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
  const publicDir = join(rootDir, "public");
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
    publicDir,
    entrypoint: {
      browser: browserEntrypoint,
      server: serverEntrypoint,
    },
    output: {
      browser: join(outputDir, browserEntrypoint),
      server: join(outputDir, serverEntrypoint),
    },
    resolveBuildPath(path: string) {
      return join(outputDir, path);
    },
    resolvePublicPath(path: string) {
      return join(outputDir, publicDir, path);
    },
    resolveOutputFileUrl(path: string) {
      return toFileUrl(join(outputDir, path));
    },
  } as const;
}
