// See:
// https://react.dev/reference/react-dom/server/renderToReadableStream#usage
// https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
export interface RendererOptions<T extends ReadableStream> {
  root: string | URL;
  render: RenderFunction<T>;
}

type RenderResult<T> = Promise<T> | T | Promise<Response> | Response;

type RenderFunction<T extends ReadableStream> = (
  request: Request,
  params?: Map<string, string | undefined>,
) => RenderResult<T>;
