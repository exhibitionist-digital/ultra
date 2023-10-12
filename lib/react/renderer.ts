import { toFileUrl } from "https://deno.land/std@0.203.0/path/to_file_url.ts";
import { ImportMap } from "../importMap.ts";

interface RequestHandler {
  handleRequest: (request: Request) => Promise<Response>;
  supportsRequest: (request: Request) => boolean;
}

interface RendererOptions<T> {
  root: string | URL;
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
): RequestHandler {
  const root = options.root instanceof URL
    ? options.root
    : toFileUrl(options.root);

  const handleRequest = async (request: Request): Promise<Response> => {
    const result = await options.render(request);

    if (result instanceof ReadableStream) {
      const transforms: TransformStream<Uint8Array, Uint8Array>[] = [];
      transforms.push(createUltraUrlTransformStream(root));

      if (options.importMap) {
        transforms.push(createImportMapTransformStream(options.importMap));
      }

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
        if (options.importMap) {
          transforms.push(
            createImportMapTransformStream(options.importMap),
          );
        }
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
    // Check if the request accepts HTML
    return true;
  };

  return {
    handleRequest,
    supportsRequest,
  };
}

function createUltraUrlTransformStream(root: URL) {
  const regex = new RegExp(root.toString(), "g");
  const transform = new TransformStream<Uint8Array, Uint8Array>({
    transform: (chunk, controller) => {
      const output = new TextDecoder().decode(chunk);
      const newOutput = output.replace(regex, "/_ultra");
      chunk = new TextEncoder().encode(newOutput);
      controller.enqueue(chunk);
    },
  });

  return transform;
}

function createImportMapTransformStream(
  importMap: ImportMap,
) {
  const importMapScript = importMap
    ? `<script type="importmap">${JSON.stringify(importMap)}</script>`
    : null;
  let importMapInjected = false;

  const transform = new TransformStream<Uint8Array, Uint8Array>({
    transform: (chunk, controller) => {
      let output = new TextDecoder().decode(chunk);

      if (importMapScript && !importMapInjected) {
        output = injectImportMapScript(importMapScript, output);
        importMapInjected = true;
      }

      chunk = new TextEncoder().encode(output);
      controller.enqueue(chunk);
    },
  });

  return transform;
}

function injectImportMapScript(importMapScript: string, output: string) {
  const head = output.match(/<head>(.*)<\/head>/s);
  if (head) {
    const headEnd = head[1].match(/<script.*<\/script>/s);
    if (headEnd) {
      console.debug("Injecting import map script before existing script tag");
      output = output.replace(
        headEnd[0],
        `${importMapScript}${headEnd[0]}`,
      );
    } else {
      // We want to inject the importMapScript before the closing </head> tag
      console.debug("Injecting import map script before closing head tag");
      output = output.replace(
        /<\/head>/,
        `${importMapScript}</head>`,
      );
    }
  } else {
    // if there is no head tag, just inject it at the top of the output
    console.debug("Injecting import map script at the top of the output");
    output = `${importMapScript}${output}`;
  }

  return output;
}
