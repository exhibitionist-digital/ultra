import {
  createBufferedTransformStream,
  createHeadInjectionTransformStream,
} from "ultra/stream.ts";

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

      /**
       * Collect all of the <style data-emotion> tags
       * and insert into our cache
       */
      while ((match = regex.exec(content)) !== null) {
        const id = match[1];
        content = content.replace(match[0], "");
        cache.set(id, match[0]);
      }

      return content;
    }),
    createHeadInjectionTransformStream(() => {
      const styles: string[] = [];
      for (const [, styleTag] of cache.entries()) {
        styles.push(styleTag);
      }
      return styles.join("\n");
    }),
  ];

  return transforms.reduce(
    (readable, transform) => readable.pipeThrough(transform),
    stream,
  );
}
