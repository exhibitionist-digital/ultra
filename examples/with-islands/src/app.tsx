import useAsset from "ultra/hooks/use-asset.js";
import useIsland from "ultra/hooks/use-island.js";
import Counter from "./islands/Counter.tsx";

const CounterIsland = useIsland(Counter);

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>with-islands</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href={useAsset("./favicon.ico")} />
        <link rel="preload" as="style" href={useAsset("./style.css")} />
        <link rel="stylesheet" href={useAsset("./style.css")} />
      </head>
      <body>
        <main>
          <CounterIsland start={0} />
          <Counter start={1} />
          <Counter start={2} />
        </main>
      </body>
    </html>
  );
}
