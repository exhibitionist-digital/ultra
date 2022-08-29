import React from "react";
import { MDXProvider } from "@mdx-js/react";
import useAsset from "ultra/hooks/use-asset.js";

const Component = React.lazy(() => import(`${location.href}mdx/docs.js`));

const Image = ({ src, ...props }: any) => {
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
          <Component />
        </body>
      </html>
    </MDXProvider>
  );
}
