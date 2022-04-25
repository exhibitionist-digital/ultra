import React from "react";
import type { AppProps, ServerRequestContext } from "../../unstable.ts";

export default function App(props: AppProps) {
  return (
    <html>
      <head>
        <title>Ultra</title>
      </head>
      <body>
        Hello world!
      </body>
    </html>
  );
}

export function createRequestContext(request: Request): ServerRequestContext {
  return {
    url: new URL(request.url),
    state: new Map([["bar", "baz"]]),
    helmetContext: {
      helmet: {},
    },
  };
}
