import useAsset from "ultra/hooks/use-asset.js";

function LiveReload() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          console.log("Connecting to dev server...");
          try {
            const ws = new WebSocket("ws://localhost:8000");
            ws.onopen = () => {
              console.log('Connected')
            };
            ws.onmessage = (message) => {
              const data = message?.data ? JSON.parse(message.data) : undefined;
              if (data) {
                console.log(data)
              }
            };
            ws.onclose = () => {
              console.log("Disconnected from dev server...");
            }
          } catch (error) {
            console.error(error)
          }
        `,
      }}
    >
    </script>
  );
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>basic</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href={useAsset("./favicon.ico")} />
        <link rel="preload" as="style" href={useAsset("./style.css")} />
        <link rel="stylesheet" href={useAsset("./style.css")} />
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
        <LiveReload />
      </body>
    </html>
  );
}
