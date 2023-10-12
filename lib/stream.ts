import { type ImportMap } from "./importMap.ts";

type RenderResponseTransformerOptions = {
  root: URL;
  importMap?: ImportMap;
};

export function createRenderResponseTransformer(
  options: RenderResponseTransformerOptions,
) {
  const { root, importMap } = options;

  const transformer = (result: Response | ReadableStream) => {
    if (result instanceof ReadableStream) {
      const transforms: TransformStream<Uint8Array, Uint8Array>[] = [];
      transforms.push(createUltraUrlTransformStream(root));

      if (importMap) {
        transforms.push(createImportMapTransformStream(importMap));
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
        if (importMap) {
          transforms.push(
            createImportMapTransformStream(importMap),
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
  };

  return transformer;
}

export function createUltraUrlTransformStream(root: URL) {
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

export function createImportMapTransformStream(
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

export function injectImportMapScript(importMapScript: string, output: string) {
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
