import { PropsWithChildren } from "react";
import useAsset from "ultra/hooks/use-asset.js";
import useIsland from "ultra/hooks/use-island.js";
import Counter from "./islands/Counter.tsx";

const CounterIsland = useIsland(Counter);

const FillViewportWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
};

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
          <p>
            Open your browser console and scroll down to see components hydrate
            as they are scrolled into the viewport.
          </p>
          <FillViewportWrapper>
            <CounterIsland start={100} />
          </FillViewportWrapper>
          <FillViewportWrapper>
            <CounterIsland start={50} />
          </FillViewportWrapper>
          <FillViewportWrapper>
            <CounterIsland start={20} />
          </FillViewportWrapper>
        </main>
      </body>
    </html>
  );
}
