import { Config } from "../config.ts";
import { fileExtension } from "../io.ts";
import { printer } from "../printer.ts";

export function appContent(config: Config) {
  const p = printer(config);
  const ext = fileExtension(config);
  // deno-fmt-ignore
  return`
  import useAsset from "ultra/hooks/use-asset.js";
  ${p.twind(`// Twind
  import { tw } from "./twind/twind.ts";
  `)}
  ${p.stitches(`// Stitches
  import { StitchesProvider } from "${ext('./stitches/StitchesProvider', true)}";
  `)}

  export default function App() {
    console.log("Hello world!");
    return (
    ${p.stitches('<StitchesProvider>')}
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <title>Ultra</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" href={useAsset("/favicon.ico")} />
          <link rel="stylesheet" href={useAsset("/style.css")} />
        </head>
        <body>
          <main>
            <h1 ${p.twind('className={tw(`text-8xl font-mono margin mb-8`)}')}>
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
              customize your routing, data fetching, and styling with popular
              libraries.
            </p>
          </main>
        </body>
      </html>
      ${p.stitches('</StitchesProvider>')}
    );
  }
   `;
}
