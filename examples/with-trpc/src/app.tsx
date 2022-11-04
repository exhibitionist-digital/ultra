import useAsset from "ultra/hooks/use-asset.js";
import { trpc } from "./trpc/trpc.ts";

export default function App() {
  const posts = trpc.post.get.useQuery();
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
            <span></span>Posts<span></span>
          </h1>
          {posts.data
            ? (
              <ul>
                {posts.data.map((post) => <li key={post.name}>{post.name}</li>)}
              </ul>
            )
            : <div>Loading...</div>}
        </main>
      </body>
    </html>
  );
}
