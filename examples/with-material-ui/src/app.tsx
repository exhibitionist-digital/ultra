import useAsset from "ultra/hooks/use-asset.js";
import { Button } from "@mui/material";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>with-material-ui</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link rel="shortcut icon" href={useAsset("/favicon.ico")} />
      </head>
      <body style={{ padding: "1em" }}>
        <Button
          variant="contained"
          onClick={() => alert("Hello World from a Material UI button!!")}
        >
          Say Hello World
        </Button>
      </body>
    </html>
  );
}
