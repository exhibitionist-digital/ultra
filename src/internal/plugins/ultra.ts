import { ImportVisitor } from "../../ast/import.ts";
import type { ParsedImportMap } from "../../deps.ts";
import type { Plugin, ResponseTransformer } from "../../types.ts";
import { isGetRequest, isHtmlResponse } from "../../utils.ts";

type PluginOptions = { importMap: ParsedImportMap };

export const ultraPlugin: Plugin<PluginOptions> = (app, { importMap }) => {
  app.compiler.addVisitor(new ImportVisitor(importMap));
  app.addResponseTransformer(
    responseTransformer,
  );
};

function replacer(_key: string, value: unknown) {
  if (value instanceof Map) {
    return Array.from(value.entries());
  } else {
    return value;
  }
}

const responseTransformer: ResponseTransformer = (
  response,
  context,
  rewriter,
) => {
  if (isGetRequest(context.request) && isHtmlResponse(response)) {
    rewriter.on("body", {
      element(element) {
        element.onEndTag((body) => {
          body.before(
            `<script id="__ultra_renderState">window.__ultra_renderState = ${
              JSON.stringify(context.state, replacer)
            }</script>`,
            { html: true },
          );
        });
      },
    });
  }
};
