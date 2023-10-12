import { toFileUrl } from "https://deno.land/std@0.203.0/path/to_file_url.ts";
import { ImportMap } from "../importMap.ts";

interface Renderer {
  handleRequest: (request: Request) => Promise<Response>;
}

interface RendererOptions<T> {
  importMap?: ImportMap;
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

  const importMapScript = options.importMap
    ? `<script type="importmap">${JSON.stringify(options.importMap)}</script>`
    : null;

  const handleRequest = async (request: Request): Promise<Response> => {
    const result = await options.render(request);

    if (result instanceof ReadableStream) {
      const transform = new TransformStream<Uint8Array, Uint8Array>({
        transform: (chunk, controller) => {
          let output = new TextDecoder().decode(chunk);

          if (importMapScript) {
            output = injectImportMapScript(importMapScript, output);
          }

          // Find any urls in the string that match the cwd and replace them with the Ultra url
          const regex = new RegExp(cwd.toString(), "g");
          output = output.replace(regex, "/_ultra");

          chunk = new TextEncoder().encode(output);
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

// Inject an import map into the head, if there is a script tag in the head, place it before that

function injectImportMapScript(importMapScript: string, output: string) {
  const head = output.match(/<head>(.*)<\/head>/s);
  if (head) {
    const headEnd = head[1].match(/<script.*<\/script>/s);
    if (headEnd) {
      output = output.replace(
        headEnd[0],
        `${importMapScript}${headEnd[0]}`,
      );
    } else {
      output = output.replace(
        head[0],
        `${head[0]}${importMapScript}`,
      );
    }
  } else {
    // if there is no head tag, just inject it at the top of the output
    output = `${importMapScript}${output}`;
  }

  return output;
}
