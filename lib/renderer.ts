// See:
// https://react.dev/reference/react-dom/server/renderToReadableStream#usage
// https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
export interface RendererOptions<T extends ResponseLike> {
  root: string | URL;
  render: RenderFunction<T>;
}

type RenderResult<T> = Promise<T> | T;
type ResponseLike = Response | ReadableStream | null;

export type RenderFunction<T extends ResponseLike> = (
  request: Request,
  params?: Map<string, string | undefined>,
) => RenderResult<T>;
