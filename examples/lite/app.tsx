
import { useState } from "react";
import UltraClient, { hydrate } from "ultra/lib/react/client.js";
import { ImportMapScript } from "ultra/lib/react/client.js";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>lite</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ImportMapScript />
      </head>
      <body>
        <main>
          <h1>
            Ultra Lite
          </h1>
          <button onClick={() => setCount(count + 1)}>
            the count is {count}
          </button>
        </main>
      </body>
    </html>
  );
};

typeof document !== "undefined" && hydrate(
  document,
  <UltraClient>
    <App />
  </UltraClient>,
);
