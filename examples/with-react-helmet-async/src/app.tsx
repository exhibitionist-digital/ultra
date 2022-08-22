import { Helmet } from "react-helmet-async";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Helmet prioritizeSeoTags>
          <title>with-react-helmet-async</title>
          <link rel="notImportant" href="https://ultrajs.com" />
          <meta name="whatever" content="notImportant" />
          <link rel="canonical" href="https://ultrajs.dev" />
          <meta property="og:title" content="A very important title" />
        </Helmet>
      </head>
      <body>
        <div>Hello with-react-helmet-async!</div>
      </body>
    </html>
  );
}
