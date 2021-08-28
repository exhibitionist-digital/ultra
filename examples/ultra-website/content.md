<!-- deno-fmt-ignore-file -->
## Deno, ESM + React: No build, no bundle, all streaming

[![View on GitHub](https://img.shields.io/badge/-View%20on%20GitHub-blue?style=for-the-badge&logo=github)](https://github.com/exhibitionist-digital/ultra)

**Ultra** is a web framework that leans hard into your browser's native
features. Embrace the future of **ES Modules**, **Import Maps**, and **Web
Streams**. All while supporting some of the non-standards that many normal
people love for some reason (**JSX** and **TypeScript**).

It's driven by the following hot-takes:

- **ESM** is non-negotiable in {currentYear}
- **SSR** is non-negotiable in {currentYear}
- Bundling is an **anti-pattern** in {currentYear}
- **Data can be requested anywhere, and is accessible on the server, always**
- **Lazy routing with dynamic imports** trumps FS routing
- **Less magic** in tooling and frameworks is a good thing
- **Simplify** your workflow and tech stack at all costs - life is too short
- **Streams** are neat

---

**Warning:** The following is built around the _alpha_ version of
[React 18](https://reactjs.org/blog/2021/06/08/the-plan-for-react-18.html).
Mileage may vary.

**Demo:**
[Here is a port of the React 18 SSR demo which showcases Suspense
SSR.](https://react18.ultrajs.dev)

---

### Native first

Everything is ES Modules. Server side rendering is default. Have the quickest
TTFB by using the React streaming server renderer.

```bash
# HTTP/2 200  

* Received 381 B chunk
* Received 8 B chunk
* Received 6 B chunk
* Received 6 B chunk
* Received 1 B chunk
* Received 5 B chunk
* Received 2 B chunk
* Received 7 B chunk
```

[Import Maps](https://github.com/WICG/import-maps) are used to manage 3rd party
dependencies. No bundling, building or complex package managers needed.

```js
{
  "imports": {
    "react": "https://esm.sh/react@alpha",
    "react-dom": "https://esm.sh/react-dom@alpha"
  }
}
```

```js
import React from "react";

export default const Graveyard = () => {
  const gravestones = [
    ".cjs",
    "require()",
    "node_modules",
    "package.json",
    "webpack.config",
    "babel.config",
    "create-react-app",
    "next.js",
  ];

  return (
    <ul className="graveyard">
      {gravestones.map((grave) => (
        <li>
          <figure>
            <img src="/grave.svg" alt="Gravestone" />
            <figcaption>{grave}</figcaption>
          </figure>
        </li>
      ));}
    </ul>
  )
};
```

**Under the hood:** We use [esbuild](https://esbuild.github.io) +
[SWC](https://swc.rs) to transpile jsx/tsx in realtime. Your single ES modules
stay single ES modules, but as minified vanilla js, with your import maps
inlined.

```bash
Transpile: graveyard.jsx in 6ms
```

```js
// Transpiled example of graveyard.jsx
import e from"https://esm.sh/react@alpha";const a=()=>e.createElement("ul",{className:"graveyard"},[".cjs","require()","node_modules","package.json","webpack.config","babel.config","create-react-app","next.js"].map(r=>e.createElement("li",null,e.createElement("figure",null,e.createElement("img",{src:"/grave.svg",alt:"Gravestone"}),e.createElement("figcaption",null,r)))));export default a;
```

**Note:** In development, modules are transpiled every request. In production,
transpiled modules are stored in an LRU cache. 👍

---

### Routing

Stop poking around at your filesystem. Routing can be defined anywhere in your
app, and dynamic imports will ensure only relevant route files are downloaded at
any given time.

Powered by [Wouter](https://github.com/molefrog/wouter). Ah, what a breath of
fresh air...

```js
import { Suspense } from "react";
import { Router } from "wouter";

const Home = lazy(() => import("./home.jsx"));

const App = () => {
  <Router>
    <Suspense path="/home" fallback={<Loading />}>
      <Home />
    </Suspense>
  </Router>;
};
```

---

### Data fetching

[SWR](https://github.com/vercel/swr) lets us fetch data anywhere in our
components, works with Suspense everywhere.

**UPDATE v0.2**: now uses SWR v.1.0.0. This allows building of a cache server side, and repopulating on client side. Please see examples [here](https://github.com/exhibitionist-digital/ultra/blob/0.2/examples/ultra-website/public/app.jsx#L5) and [here](https://github.com/exhibitionist-digital/ultra/blob/0.2/examples/ultra-website/public/app.jsx#L5).

```js
import { Suspense } from "react";
import useSWR from "swr";

const Profile = () => {
  const { data } = useSWR("/api/user", fetcher, { suspense: true });
  return <div>hello, {data.name}</div>;
};

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Profile />
    </Suspense>
  );
};
```
