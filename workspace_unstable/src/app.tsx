import React from "react";
import type { AppProps, ServerRequestContext } from "../../unstable.ts";

export default function App({ requestContext }: AppProps) {
  console.log(requestContext.state);
  return (
    <div>
      Hello World!
    </div>
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
