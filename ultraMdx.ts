import * as UUV from "https://esm.sh/unist-util-visit";
import { Root } from "https://esm.sh/@types/mdast";

const ultraMdx = () => {
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
