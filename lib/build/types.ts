import { Builder, BuildResult } from "./deps.ts";

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

export type BuildPlugin = {
  /**
   * The name of the plugin.
   */
  name: string;
  onBuild: (context: Builder, result: BuildResult) => Promise<void> | void;
};
