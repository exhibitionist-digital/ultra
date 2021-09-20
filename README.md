<div align="center">
  <br />
  <img src="https://dweb.link/ipfs/bafkreiah6lyqltjzmqaggn3iang6sip7tnbotvxyqeg6zgrem6wqniegfm" height="250" />
  <h1>Ultra</h1>
  <strong>Deno + React: No build, no bundle, all streaming</strong>
  <br /><br />

[![GitHub Workflow Status][actions-badge]][actions]

</div>

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

Here are some neat demos:

### 👩‍🚀👨‍🚀 React 18: Suspense SSR

[Demo (taken from React's release announcement)](https://react18.ultrajs.dev)

### 🔥🔥 React Three Fiber

[Threejs, react, no build, no bundle](https://threejs.ultrajs.dev/)

### Quick start

The most minimal setup of **Ultra** can be found at
[/examples/boilerplate](https://github.com/exhibitionist-digital/ultra/tree/master/examples/boilerplate).
There are more
[/examples](https://github.com/exhibitionist-digital/ultra/tree/master/examples)
as well.

---

<details><summary>HOW IT WORKS</summary>

<br/>

Everything is ES Modules. Server side rendering is default. Have the quickest
TTFB by using the React streaming server renderer.

```bash
# HTTP/2 200

* Received 1259 B chunk
* Received 1989 B chunk
* Received 552 B chunk
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

**Under the hood:** We use [esbuild](https://esbuild.github.io) +
[SWC](https://swc.rs) to transpile jsx/tsx in realtime. Your single ES modules
stay single ES modules, but as minified vanilla js, with your import maps
inlined.

**Note:** In development, modules are transpiled every request. In production,
transpiled modules are stored in an LRU cache. 👍

</details>

---

<details><summary>LAZY ROUTING</summary>

<br/>

Stop poking around at your filesystem. Routing can be defined anywhere in your
app, and dynamic imports will ensure only relevant route files are downloaded at
any given time.

Powered by [Wouter](https://github.com/molefrog/wouter). Ah, what a breath of
fresh air...

All Wouter hooks and functionality is supported:
[Wouter docs](https://github.com/molefrog/wouter#wouter-api)

```js
import React, { Suspense } from "react";
import { Route } from "wouter";

const Home = lazy(() => import("./home.jsx"));

const App = () => {
  return (
    <Route path="/">
      <Suspense fallback={<Loading />}>
        <Home />
      </Suspense>
    </Route>
  );
};
```

</details>

---

<details><summary>SUSPENSE DATA FETCHING</summary>

<br/>

[SWR](https://github.com/vercel/swr) lets us fetch data anywhere in our
components, works with Suspense everywhere.

Ultra uses the brand new SWR-1.0.0. This allows building of a cache server side,
and repopulating on client side. Please see example
[here](https://github.com/exhibitionist-digital/ultra/blob/master/examples/ultra-website/src/app.jsx#L5).

SWR options are supported:
[SWR docs](https://swr.vercel.app/docs/options#options)

```js
import { SWRConfig } from "swr";
import ultraCache from "ultra/cache";

const options = (cache) => ({
  provider: () => ultraCache(cache),
  suspense: true,
});

const Ultra = ({ cache }) => {
  return (
    <SWRConfig value={options(cache)}>
      <h1>Hello World</h1>
    </SWRConfig>
  );
};
```

</details>

---

<details><summary>MIDDLEWARE + API ROUTES</summary>

<br/>

Ultra is powered by the mighty [Oak](https://github.com/oakserver/oak). We
expose both the `app` and `router`, which can be configured for any custom
middleware or routing your app might need.

[Oak docs](https://github.com/oakserver/oak#application-middleware-and-context)

```js
import ultra, { app } from "https://deno.land/x/ultra@v0.6/mod.ts";

// logger middleware
app.use(async (context, next) => {
  await next();
  const rt = context.response.headers.get("X-Response-Time");
  console.log(`${context.request.method} ${context.request.url} - ${rt}`);
});

await ultra({
  importmap: await Deno.readTextFile("importmap.json"),
});
```

Custom routes can all be added, helpful for API's.

```js
import ultra, { router } from "https://deno.land/x/ultra@v0.6/mod.ts";

// example API route
router.get("/api/:slug", async (context) => {
  // ...
});

await ultra({
  importmap: await Deno.readTextFile("importmap.json"),
});
```

</details>

---

<details><summary>DEPLOYING</summary>

<br/>

**Classic deployment:** Ultra can be deployed via Docker. Here is an example
Dockerfile which uses the official Denoland image.

```bash
FROM denoland/deno:1.14.0

EXPOSE 3000 

RUN apt-get update && apt-get -y install make

WORKDIR /

COPY . .

RUN make cache

CMD ["make", "start"]
```

---

We are currently working on support for [Deno Deploy](https://deno.com/deploy),
[Cloudflare Workers](https://workers.cloudflare.com/), and
[Vercel](https://vercel.com/). Keen to help? Open a PR, please! 🙏

</details>

[docs-badge]: https://img.shields.io/github/v/release/exhibitionist-digital/ultra?label=Docs&logo=deno&style=for-the-badge&color=B06892&
[docs]: https://doc.deno.land/https/deno.land/x/ultra/mod.js&
[actions-badge]: https://img.shields.io/github/workflow/status/exhibitionist-digital/ultra/fmt%20+%20lint?style=for-the-badge&color=53A3D3&logo=github&label=
[actions]: https://github.com/exhibitionist-digital/ultra/actions
