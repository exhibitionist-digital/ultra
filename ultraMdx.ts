import * as UUV from "https://esm.sh/unist-util-visit";

const ultraMdx = () => {
  // @ts-ignore MDAST type needed
  return (tree: Root) => {
    return UUV.visit(tree, "mdxjsEsm", (node) => {
      node?.data?.estree?.body?.forEach((i: { source: { raw: string } }) => {
        if (i?.source?.raw) {
          i.source.raw = i.source.raw.replace(/\.(j|t)sx?/gi, ".js");
        }
      });
    });
  };
};

export default ultraMdx;
