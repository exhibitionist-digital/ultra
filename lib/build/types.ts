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
   * The output directory for built files.
   */
  output?: string;
  /**
   * The files specified in exclude will be ignored by the build script.
   * They won't be copied to the output directory or participate in any further processing.
   */
  exclude?: string[];
  /**
   * Force reload of dependencies when vendoring.
   */
  reload?: boolean;
  /**
   * Output source maps for compiled sources.
   */
  sourceMaps?: boolean;
  /**
   * A build plugin to run after completing the initial build
   */
  plugin?: BuildPlugin;
};

export type BuildPlugin = {
  name: string;
  onPreBuild?: (context: BuildContext) => Promise<void> | void;
  onBuild: (result: BuildResult) => Promise<void> | void;
  onPostBuild?: (result: BuildResult) => Promise<void> | void;
};

export type BuildContext = {
  paths: ResolvedPaths;
  files: Map<string, string>;
  graph?: ModuleGraph;
};

export type BuildResult = {
  options: BuildOptions;
  denoConfig: DenoConfig;
  paths: ResolvedPaths;
  importMap: ImportMap;
  assetManifest: Map<string, string>;
  /**
   * A map of files with the source path as the key
   * and the output path as the value.
   */
  files: Map<string, string>;
};
