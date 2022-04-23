import React from "react";
import type { AppProps } from "../../unstable.ts";

export default function App({ requestContext }: AppProps) {
  return (
    <div>
      Hello World!
      <pre>{JSON.stringify(requestContext, null, 2)}</pre>
    </div>
  );
}
