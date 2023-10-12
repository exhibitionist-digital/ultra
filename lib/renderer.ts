import { type ImportMap } from "./importMap.ts";

export interface RendererOptions<T> {
  root: string | URL;
  importMap?: ImportMap;
  render: RenderFunction<T>;
}

type RenderResult<T> = Promise<T> | T | Promise<Response> | Response;

type RenderFunction<T> = (
  request: Request,
  params?: Map<string, string | undefined>,
) => RenderResult<T>;
