import useAsset from "ultra/hooks/use-asset.js";
import useEnv from "ultra/hooks/use-env.js";
import Button from "@/components/Button.tsx";

export default function App() {
  // Read our environment variable from '.env' or the host environment
  const foo = useEnv("ULTRA_PUBLIC_FOO");
  console.log(foo);

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
          <h1>
            <span></span>__<span></span>
          </h1>
          <p>
            Welcome to{" "}
            <strong>Ultra</strong>. This is a barebones starter for your web
            app.
          </p>
          <p>
            Take{" "}
            <a
              href="https://ultrajs.dev/docs"
              target="_blank"
            >
              this
            </a>, you may need it where you are going. It will show you how to
            customise your routing, data fetching, and styling with popular
            libraries.
          </p>
          <Button>Button</Button>
        </main>
      </body>
    </html>
  );
}
