import { DenoConfig, ImportMap } from "../types.ts";
import { ResolvedPaths } from "./resolvePaths.ts";
import type {
  Module,
  ModuleGraph,
} from "https://deno.land/x/deno_graph@0.32.0/lib/types.d.ts";

export type { Module, ModuleGraph };

export type BuildOptions = {
  /**
   * The browser entrypoint. This is what initially gets sent with the server
   * rendered HTML markup. This should be what hydrates your React application.
   */
  browserEntrypoint: string;
  /**
   * The server entrypoint. This should be what handles your SSR and routing.
   */
  serverEntrypoint: string;
  /**
   * The output directory relative to the project root for built files.
   * @default ".ultra"
   */
  output?: string;
  /**
   * An array of files relative to the project root to exclude from the build process.
   * They won't be copied to the output directory or participate in any further processing.
   *
   * @default [".git", ".DS_Store"]
   */
  exclude?: string[];
  /**
   * An array of file names relative to the "public" directory that will
   * be excluded from being hashed and added to the asset-manifest.json
   *
   * @default ["robots.txt"]
   */
  assetsExclude?: string[];
  /**
   * Force reload of dependencies when vendoring.
   *
   * @default false
   */
  reload?: boolean;
  /**
   * Output source maps for compiled sources.
   *
   * @default false
   */
  sourceMaps?: boolean;
  /**
   * A build plugin to run after completing the initial build
   *
   * @default undefined
   */
  plugin?: BuildPlugin;
};

export type BuildTarget = "browser" | "server";

export type BuildPlugin = {
  /**
   * The name of the plugin.
   */
  name: string;
  onPreBuild?: (context: BuildContext) => Promise<void> | void;
  onBuild: (result: BuildResult) => Promise<void> | void;
  onPostBuild?: (result: BuildResult) => Promise<void> | void;
};

export type BuildContext = {
  paths: ResolvedPaths;
  files: Map<string, string>;
  /**
   * A ModuleGraph representing the graph of dependencies for the browserEntrypoint
   */
  graph?: ModuleGraph;
};

export type BuildResult = {
  options: BuildOptions;
  denoConfig: DenoConfig;
  paths: ResolvedPaths;
  importMap: {
    browser: ImportMap;
    server: ImportMap;
  };
  assetManifest: Map<string, string>;
  /**
   * A map of files with the source path as the key
   * and the output path as the value.
   */
  files: Map<string, string>;
};
