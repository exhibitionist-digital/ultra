import React from "react";
import ReactDOM from "react-dom/server";
import { isDev, root } from "../env.ts";
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
    const {
      requestContext,
      chunkSize = defaultChunkSize,
      importMapResolver,
    } = options;

    const {
      locale = defaultLocale,
      renderStrategy = defaultRenderStrategy,
    } = requestContext;

    const controller = new AbortController();
    let didError = false;

    try {
      const stream = await ReactDOM
        .renderToReadableStream(
          <App requestContext={requestContext} />,
          {
            signal: controller.signal,
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

const socket = (root: string) => {
  const url = new URL(root);
  return `
    const _ultra_socket = new WebSocket("ws://${url.host}/_ultra_socket");
    _ultra_socket.addEventListener("message", (e) => {
      if (e.data === "reload") {
        location.reload();
      }
    });
  `;
};
