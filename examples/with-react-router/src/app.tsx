import { PropsWithChildren } from "react";
import useAsset from "ultra/hooks/use-asset.js";

export default function App({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>with-react-router</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href={useAsset("/favicon.ico")} />
        <link rel="preload" as="style" href={useAsset("/style.css")} />
        <link rel="stylesheet" href={useAsset("/style.css")} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
