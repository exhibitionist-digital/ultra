import type { Plugin, ResponseTransformer, State } from "../types.ts";
import { isGetRequest, isHtmlResponse } from "../utils.ts";

type StateWithHelmet = State & {
  // deno-lint-ignore no-explicit-any
  helmet: Record<string, any>;
};

export const reactHelmetPlugin: Plugin = (app) => {
  app.addResponseTransformer(responseTransformer);
};

const responseTransformer: ResponseTransformer = (
  response,
  context,
  rewriter,
) => {
  if (isGetRequest(context.request) && isHtmlResponse(response)) {
    rewriter.on("head", {
      element(element) {
        const { helmet } = context.state as StateWithHelmet;

        if (helmet) {
          const head = [
            helmet.title.toString(),
            helmet.priority.toString(),
            helmet.meta.toString(),
            helmet.link.toString(),
            helmet.script.toString(),
          ].join("\n");

          element.append(head, { html: true });
        }
      },
    });
  }
};
