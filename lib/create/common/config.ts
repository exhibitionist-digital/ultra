export type Libraries =
  | "twind"
  | "stitches"
  | "react-helmet-async"
  | "react-query"
  | "react-router"
  | "wouter"
  | "trpc"
  | "none";

export interface Config {
  name: string;
  ts: boolean;
  cwd: string;
  includes: Libraries[];
}
