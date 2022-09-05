import {
  createBufferedTransformStream,
  createHeadInjectionTransformStream,
} from "../../../stream.ts";

const regex = new RegExp(
  `<style data-emotion="css ([a-zA-Z0-9-_ ]+)">(.+)<\\/style>`,
  "gm",
);

export function emotionTransformStream(
  stream: ReadableStream<Uint8Array>,
  cache: Map<string, string> = new Map(),
) {
  const transforms = [
    createBufferedTransformStream((content) => {
      let match;

      regex.lastIndex = 0;

      while ((match = regex.exec(content)) !== null) {
        const id = match[1];
        const css = match[2];
        content = content.replace(match[0], "");
        cache.set(id, css);
      }

      return content;
    }),
    createHeadInjectionTransformStream(() => {
      const styles: string[] = [];
      for (const [id, css] of cache.entries()) {
        styles.push(`<style data-emotion="css ${id}">${css}</style>`);
      }
      return styles.join("\n");
    }),
  ];

  return transforms.reduce(
    (readable, transform) => readable.pipeThrough(transform),
    stream,
  );
}
