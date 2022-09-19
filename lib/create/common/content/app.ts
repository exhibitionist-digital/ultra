import { Config } from "../config.ts";
import { fileExtension } from "../io.ts";
import { printer } from "../printer.ts";

export function appContent(config: Config) {
  const p = printer(config);
  const ext = fileExtension(config);
  // deno-fmt-ignore
  return`

  ${p.twind(`// Twind
  import { TwindProvider } from "${ext('./twind/TwindProvider', true)}";
  `)}
  ${p.stitches(`// Stitches
  import { StitchesProvider } from "${ext('./stitches/StitchesProvider', true)}";
  `)}


     export default function App() {
       console.log("Hello world!");
       return (
        ${p.twind('<TwindProvider>')} 
        ${p.stitches('<StitchesProvider>')}
         <html lang="en">
           <head>
             <meta charSet="utf-8" />
             <title>Ultra</title>
             <meta name="viewport" content="width=device-width, initial-scale=1" />
             <link rel="shortcut icon" href="/favicon.ico" />
             <link rel="stylesheet" href="/style.css" />
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
             </main>
           </body>
         </html>
         ${p.stitches('</StitchesProvider>')}
         ${p.twind('</TwindProvider>')}
       );
     }
   `;
}
