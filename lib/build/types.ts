import { BuildResult, PatternLike } from "./deps.ts";
import { UltraBuilder } from "./ultra.ts";

export type { BuildResult, PatternLike };

export type DenoConfig = {
  tasks?: Record<string, string>;
  compilerOptions?: {
    jsx: "preserve" | "react" | "react-jsx" | "react-jsxdev";
    jsxImportSource?: string;
  };
  importMap?: string;
};

export type BuildOptions = {
  /**
   * The absolute path to the root of the project.
   * @default Deno.cwd()
   */
  root: string;
  /**
   * The output directory relative to the project root for built files.
   * @default ".ultra"
   */
  output?: string;
  /**
   * A relative path of the output directory to place vendored remote dependencies.
   * @default "vendor"
   */
  vendorPath: string;
  /**
   * A flag to enable or disable vendoring remote dependencies.
   * @default true
   */
  vendorDependencies: boolean;
  /**
   * The relative path to your importMap
   * @default "./importMap.json"
   */
  importMapPath: string;
  /**
   * The browser entrypoint. This is what initially gets sent with the server
   * rendered HTML markup. This should be what hydrates your React application.
   *
   * This is optional, not providing it will allow you to bypass hydration.
   */
  browserEntrypoint?: string;
  /**
   * The server entrypoint. This should be what handles your SSR and routing.
   */
  serverEntrypoint: string;
  /**
   * @default true
   */
  inlineServerDynamicImports: boolean;
  /**
   * An array of files relative to the project root to be ignored from the build process.
   * They won't be copied to the output directory or participate in any further processing.
   *
   * @default [".git", ".DS_Store"]
   */
  ignored?: string[];
  /**
   * Output source maps for compiled sources.
   *
   * @default false
   */
  sourceMaps?: boolean;
  /**
   * The import specifier to resolve jsx-runtime.
   * @default "react"
   */
  jsxImportSource?: string;
  /**
   * A build plugin to run after completing the initial build
   *
   * @default undefined
   */
  plugin?: BuildPlugin;
};

export type BuildPlugin = {
  /**
   * The name of the plugin.
   */
  name: string;
  onBuild: (context: UltraBuilder, result: BuildResult) => Promise<void> | void;
};
