import type { Plugin, ResponseTransformer } from "../types.ts";
import { isGetRequest, isHtmlResponse } from "../utils.ts";

type PluginOptions = {
  getCssText: () => string;
};

export const stitchesPlugin: Plugin<PluginOptions> = (app, options) => {
  app.addResponseTransformer(
    createResponseTransformer(options.getCssText),
  );
};

function createResponseTransformer(
  getCssText: () => string,
): ResponseTransformer {
  return function responseTransformer(
    response,
    context,
    rewriter,
  ) {
    if (isGetRequest(context.request) && isHtmlResponse(response)) {
      rewriter.on("head", {
        element(element) {
          element.append(`<style id="stitches">${getCssText()}</style>`, {
            html: true,
          });
        },
      });
    }
  };
}
