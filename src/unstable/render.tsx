import React from "react";
import ReactDOM from "react-dom/server";

import { AppComponent, Renderer, RequestContext } from "./types.ts";

const progressiveChunkSize = 8 * 1024;

export function createRenderer(App: AppComponent): Renderer {
  return async function renderToStream(
    requestContext: RequestContext,
  ): Promise<Response> {
    const { renderStrategy } = requestContext;

    const controller = new AbortController();
    let didError = false;

    try {
      const stream = await ReactDOM.renderToReadableStream(
        <App />,
        {
          signal: controller.signal,
          progressiveChunkSize,
          bootstrapModules: ["/client.entry.js"],
          onError(error) {
            didError = true;
            console.log(error);
          },
        },
      );

      if (renderStrategy === "static") {
        await stream.allReady;
      }

      return new Response(stream, {
        status: didError ? 500 : 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
