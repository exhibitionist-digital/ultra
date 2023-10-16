import { toFileUrl } from "../deps.ts";
import { createUltraUrlTransformStream } from "../stream.ts";

export function createRenderHandler(options) {
  const root = options.root instanceof URL
    ? options.root
    : toFileUrl(options.root);

  const handleRequest = async (request: Request): Promise<Response> => {
    const result = await options.render(request);

    if (result instanceof ReadableStream) {
      const transforms: TransformStream<Uint8Array, Uint8Array>[] = [];
      transforms.push(createUltraUrlTransformStream(root));

      const stream = transforms.reduce(
        (readable, transform) => readable.pipeThrough(transform),
        result as ReadableStream<Uint8Array>,
      );

      return new Response(stream, {
        headers: {
          "content-type": "text/html",
        },
      });
    }

    if (result instanceof Response) {
      const transforms: TransformStream<Uint8Array, Uint8Array>[] = [];

      if (result.body) {
        transforms.push(createUltraUrlTransformStream(root));
      }

      const stream = transforms.reduce(
        (readable, transform) => readable.pipeThrough(transform),
        result.body as ReadableStream<Uint8Array>,
      );

      return new Response(stream, {
        headers: result.headers,
      });
    }

    return new Response(null, { status: 404 });
  };

  const supportsRequest = (request: Request): boolean => {
    const accept = request.headers.get("accept");
    if (!accept?.includes("text/html")) {
      return false;
    }
    return true;
  };

  return {
    handleRequest,
    supportsRequest,
  };
}
