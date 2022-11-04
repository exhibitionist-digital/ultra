import useAsset from "ultra/hooks/use-asset.js";
import island from "ultra/hooks/use-island.js";
import Counter from "./Counter.tsx";

const CounterIsland = island(Counter);

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>basic</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href={useAsset("/favicon.ico")} />
        <link rel="preload" as="style" href={useAsset("/style.css")} />
        <link rel="stylesheet" href={useAsset("/style.css")} />
      </head>
      <body>
        <main>
          <CounterIsland start={50} hydrationStrategy="visible" />
        </main>
      </body>
    </html>
  );
}
