import useAsset from "ultra/hooks/use-asset.js";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>basic</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href={useAsset("/favicon.ico")} />
        <link rel="preload" as="style" href={useAsset("/main.css")} />
        <link rel="stylesheet" href={useAsset("/main.css")} />
      </head>
      <body className="m-0 p-4 font-mono bg-amber text-center">
        <main>
          <p>
            Welcome to{" "}
            <strong>Ultra</strong>. This is a barebones starter for your web
            app.
          </p>
          <p>
            Take{" "}
            <a href="https://ultrajs.dev/docs" target="_blank">
              this
            </a>
            , you may need it where you are going. It will show you how to
            customise your routing, data fetching, and styling with popular
            libraries.
          </p>
        </main>
      </body>
    </html>
  );
}
