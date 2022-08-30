export default function App({ request }: { request: Request }) {
  console.log({ request: new URL(request.url) });
  const path = new URL(request.url).pathname;
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
          <h2>
            {path == "/" ? "Home" : "404"}
          </h2>
        </main>
      </body>
    </html>
  );
}
