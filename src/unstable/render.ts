import React from "react";
import ReactDOM from "react-dom/server";
import { encodeStream, pushBody } from "../stream.ts";

import {
  AppComponent,
  RenderOptions as UnstableRenderOptions,
  RenderStrategy,
} from "./types.ts";

const defaultChunkSize = 8 * 1024;
const defaultLocale = "en";
const defaultRenderStrategy: RenderStrategy = "stream";

export function createRenderer(App: AppComponent) {
  return async function renderToStream(
    options: UnstableRenderOptions,
  ): Promise<Response> {
    const { requestContext, chunkSize = defaultChunkSize, importMapResolver } =
      options;
    const { locale = defaultLocale, renderStrategy = defaultRenderStrategy } =
      requestContext;

    const controller = new AbortController();

    try {
      const stream = await ReactDOM
        .renderToReadableStream(
          React.createElement(App, { requestContext }),
          {
            signal: controller.signal,
          },
        );

      if (renderStrategy === "static") {
        await stream.allReady;
      }

      // head builder
      const renderHead = () => {
        const { helmet } = requestContext.helmetContext;
        const head = `<!DOCTYPE html><html lang="${locale}"><head>${
          Object.keys(helmet)
            .map((i) => helmet[i].toString())
            .join("")
        }<script type="module" defer>
          import { createElement } from "${
          importMapResolver.resolveHref("react")
        }";
          import { hydrateRoot } from "${
          importMapResolver.resolveHref("react-dom/client")
        }";
          import App from "/app.js";
          const root = hydrateRoot(
            document.getElementById("ultra"),
            createElement(App, { requestContext: self.__ultra_request_context })
          )
        </script></head><body><div id="ultra">`;
        return head;
      };

      // tail builder
      const renderTail = () => {
        const { state } = requestContext;
        return `</div></body>
        <script>self.__ultra = ${
          JSON.stringify(Array.from(state.entries()))
        }</script>
        <script type="application/json">${
          JSON.stringify(requestContext)
        }</script>
        </html>`;
      };

      const reader = stream.getReader();

      return new Response(
        encodeStream(
          new ReadableStream({
            start(controller) {
              const queue = (part: string | Uint8Array) => {
                return Promise.resolve(controller.enqueue(part));
              };

              queue(renderHead())
                .then(() => pushBody(reader, controller, chunkSize))
                .then(() => queue(renderTail()))
                .then(() => controller.close());
            },
          }),
        ),
        {
          headers: {
            "content-type": "text/html; charset=utf-8",
          },
        },
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

function jsonStringify(value: any): string {
  function replacer(key: string, value: any) {
    if (value instanceof Map) {
      return {
        dataType: "Map",
        value: Array.from(value.entries()),
      };
    } else {
      return value;
    }
  }
  return JSON.stringify(value, replacer);
}
