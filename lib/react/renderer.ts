import { toFileUrl } from "https://deno.land/std@0.203.0/path/to_file_url.ts";

interface Renderer {
  handleRequest: (request: Request) => Promise<Response>;
}

interface RendererOptions<T> {
  render: RenderFunction<T>;
}

type RenderResult<T> = Promise<T> | T | Promise<Response> | Response;

type RenderFunction<T> = (
  request: Request,
  params?: Map<string, string | undefined>,
) => RenderResult<T>;

export function createRenderer(
  options: RendererOptions<JSX.Element>,
): Renderer {
  const cwd = toFileUrl(Deno.cwd());

  const handleRequest = async (request: Request): Promise<Response> => {
    const result = await options.render(request);

    if (result instanceof ReadableStream) {
      const transform = new TransformStream<Uint8Array, Uint8Array>({
        transform: (chunk, controller) => {
          const string = new TextDecoder().decode(chunk);

          // Find any urls in the string that match the cwd and replace them with the Ultra url
          const regex = new RegExp(cwd.toString(), "g");
          const replaced = string.replace(regex, "/_ultra");

          chunk = new TextEncoder().encode(replaced);
          controller.enqueue(chunk);
        },
      });

      result.pipeThrough(transform);

      return new Response(transform.readable, {
        headers: {
          "content-type": "text/html",
        },
      });
    }

    if (result instanceof Response) {
      return result;
    }

    return new Response(null, { status: 404 });
  };

  return {
    handleRequest,
  };
}
