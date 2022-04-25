/** @jsxImportSource react */
import type { AppProps, RequestContextFunction } from "../../unstable.ts";

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

export const createRequestContext: RequestContextFunction = (request) => {
  return {
    url: new URL(request.url),
    renderStrategy: "static",
  };
};
