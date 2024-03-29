import { MDXProvider } from "@mdx-js/react";
import useAsset from "ultra/hooks/use-asset.js";

import Docs from "./content/docs.js";

const Image = (
  { src, ...props }: React.ImgHTMLAttributes<HTMLImageElement>,
) => {
  return <img src={useAsset(src)} {...props} />;
};

export default function App() {
  return (
    <MDXProvider
      components={{
        img: Image,
      }}
    >
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <title>With with-mdx</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </head>
        <body>
          <h1>Hello World</h1>
          <Docs />
        </body>
      </html>
    </MDXProvider>
  );
}
