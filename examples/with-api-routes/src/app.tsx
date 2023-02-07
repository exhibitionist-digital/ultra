import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    // connect to websocket
    const socket = new WebSocket("ws://localhost:8000/ws");
    console.log({ socket });
  }, []);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>With with-api-routes</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body>
        <div>Hello with-api-routes!</div>
      </body>
    </html>
  );
}
