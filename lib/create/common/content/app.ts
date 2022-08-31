export function appContent() {
  // deno-fmt-ignore
  return`
     export default function App() {
       console.log("Hello world!");
       return (
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
             </main>
           </body>
         </html>
       );
     }
   `;
}
