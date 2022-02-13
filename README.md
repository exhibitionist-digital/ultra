<div align="center">
<br />
<img src="./workspace/src/ultra.svg" height="250" />

### ULTRA

#### Modern Streaming React Framework

</div>

---

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

### v0.7.0

This is a near full rewrite of Ultra. It includes:

- Removal of Oak, in favour of `std/http` library. This makes it heaps easier to
  deploy to multiple targets
- Addition of `preloadmodule` headers for core Ultra components
- Main `app` entry point added to `importMap`
- Deno Deploy support
- Fly/Docker support
- Vercel support
- Example projects moved into their own repos for easier hacking

---

### v1.0.0 Roadmap (+ Beyond)

As we await the official release of React 18, here some things we are interested
in for the future of Ultra:

- Deno [vendor](https://github.com/denoland/deno/issues/13346): Serve remote
  packages locally
- React 18 [ESM support](https://github.com/facebook/react/issues/11503)
- Native import maps: Browser support for import maps is still a bit sketchy.
  Instead of using import map polyfills, Ultra inlines your imports directly
  into the served ES modules. We look forward to rolling this back in the future
- Simpler alternatives to [esm.sh](https://esm.sh)
- [Dynamic import](https://github.com/denoland/deploy_feedback/issues/1) support
  on Deno Deploy
- [Native CSS modules](https://css-tricks.com/css-modules-the-native-ones/)
- A custom `request` context hook
- Meaningful Puppeteer tests

Thank you for going on this journey with us.

---

**Warning:** The following is built around the _alpha_ version of
[React 18](https://reactjs.org/blog/2021/06/08/the-plan-for-react-18.html).
Mileage may vary.

Here are some neat demos:

### 👩‍🚀👨‍🚀 React 18: Suspense SSR

[Demo (taken from React's release announcement)](https://react18.ultrajs.dev)

### 📦📦 React Three Fiber

[Threejs, react, no build, no bundle](https://threejs.ultrajs.dev/)

<!--
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

<details><summary>DEPLOYING</summary>

<br/>

**Classic deployment:** Ultra can be deployed via Docker. Here is an example
Dockerfile which uses the official Denoland image.

```bash
FROM denoland/deno:1.18.1

EXPOSE 3000

RUN apt-get update && apt-get -y install make

WORKDIR /

COPY . .

RUN make cache

CMD ["make", "start"]
```

</details> -->
