import { lazy, Suspense } from "react";
import Post from "./post.tsx";
import { tw } from "./twind.ts";

const LazyPost = lazy(() => import("./post.tsx"));

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>with-twind</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body>
        <div className={tw(`flex flex-col gap-4`)}>
          <Suspense>
            <Post />
            <Post />
            <Post />
            <LazyPost color="red" />
            <LazyPost color="green" />
            <LazyPost color="purple" />
          </Suspense>
        </div>
      </body>
    </html>
  );
}
