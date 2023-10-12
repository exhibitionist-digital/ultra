import { ImportMap } from "./importMap.ts";

export function createUltraUrlTransformStream(root: URL) {
  const regex = new RegExp(root.toString(), "g");
  let buffer = "";

  const transform = new TransformStream<Uint8Array, Uint8Array>({
    transform: (chunk) => {
      const output = new TextDecoder().decode(chunk);
      buffer += output;
    },
    flush: (controller) => {
      const newOutput = buffer.replace(regex, "/_ultra");
      const chunk = new TextEncoder().encode(newOutput);
      controller.enqueue(chunk);
      controller.terminate();
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
