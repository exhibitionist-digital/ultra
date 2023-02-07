import useEnv from "ultra/hooks/use-env.js";

export default function App() {
  // Read our environment variable from '.env' or the host environment
  const foo = useEnv("ULTRA_PUBLIC_FOO");
  console.log(foo);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Ultra</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <h1>Yep, hello</h1>
      </body>
    </html>
  );
}
