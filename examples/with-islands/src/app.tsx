import { PropsWithChildren } from "react";
import useAsset from "ultra/hooks/use-asset.js";
import island from "ultra/hooks/use-island.js";
import Counter from "./Counter.tsx";

const CounterIsland = island(Counter);

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
  console.log("hello world");
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
            hydrationStrategy: load
            <CounterIsland start={50} hydrationStrategy="load" />
          </FillViewportWrapper>
          <FillViewportWrapper>
            hydrationStrategy: idle
            <CounterIsland start={100} hydrationStrategy="idle" />
          </FillViewportWrapper>
          <FillViewportWrapper>
            hydrationStrategy: visible
            <CounterIsland start={20} hydrationStrategy="visible" />
          </FillViewportWrapper>
        </main>
      </body>
    </html>
  );
}
