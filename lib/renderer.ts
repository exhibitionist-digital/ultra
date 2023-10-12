export interface RendererOptions<T> {
  root: string | URL;
  render: RenderFunction<T>;
}

type RenderResult<T> = Promise<T> | T | Promise<Response> | Response;

type RenderFunction<T> = (
  request: Request,
  params?: Map<string, string | undefined>,
) => RenderResult<T>;
