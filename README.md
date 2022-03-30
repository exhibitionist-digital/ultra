<div align="center">
<br />
<img src="https://ultrajs.dev/ultra.svg" height="250" />

### ULTRA

#### Modern Streaming React Framework

[ultrajs.dev](https://ultrajs.dev)

[![GitHub Workflow Status][actions-badge]][actions]
[![deno module](https://shield.deno.dev/x/ultra)](https://deno.land/x/ultra)
![deno compatibility](https://shield.deno.dev/deno/^1.20.3)

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

### 👯 Community

We now have a [Discord](https://discord.gg/gNDRMv8p). Come say HI.

---

### 🙌 next

We are working towards the next milestone.
[v1.0.0](https://github.com/exhibitionist-digital/ultra/milestone/2) 🗿

---

### 🚧 v0.8.0

Heaps of updates in v0.8.0! Because of these new features. Please ensure you are
using at least Deno `v1.20.3`

- **Vendored dependencies!** We have a script that can take your CDN deps and
  make them local.
- **API routes!** (Thanks @Industrial)
- Option to **disable streaming** 😱. Passing the env `disableStreaming=1` will
  force Ultra to use a custom `renderToString` equivalent - returning a **fully
  resolved, suspense compatible**, html page! (BETA)
- **Websocket refresh** in dev mode. Ultra will restart on local changes.
- Full support for
  [react@rc](https://github.com/reactjs/rfcs/blob/react-18/text/0000-react-18.md):
  There were some updates to how
  [streams are handled](https://github.com/reactwg/react-18/discussions/122) in
  the latest `rc`.
- Tighter integration with
  [Deno config file](https://deno.land/manual/getting_started/configuration_file).
  Specifiying your `importMap` in `deno.json` is **required**
- Removal of `makefile` in favour of
  [deno task](https://deno.com/blog/v1.20#new-subcommand-deno-task)
- **Legacy**: We also export an [Oak](https://deno.land/x/oak) compatible
  `ultraHandler` for support inside of an pre-existing Oak project

---

### Notes on using Deno Deploy

We aim to support Deno Deploy as a first class target for Ultra, but there are a
few things to consider before deploying:

- [Dynamic imports are not supported](https://github.com/denoland/deploy_feedback/issues/1),
  this means using React Lazy imports will not work. If you try to deploy
  anything with dynamic imports, the project will fail.
- [Recursive requests are not supported](https://github.com/denoland/deploy_feedback/issues/187),
  if using API routes, there is a good chance any requests made in your
  components may fail during SSR.

NOTE: These above issues are not a limitation when deploying to a service like
Fly.io, and if you require either of the above, we recommend using Fly.io with a
custom dockerfile.

---

### ✨ Wishlist

As we await the official release of React 18, here some things we are interested
in for the future of JS and/or Ultra:

- Better
  [Deno support in Vercel](https://github.com/vercel-community/deno/issues/95)
- React 18 [native ESM exports](https://github.com/facebook/react/issues/11503)
- [Native import maps](https://caniuse.com/import-maps): Browser support for
  import maps is still a bit sketchy. Instead of using import map polyfills,
  Ultra inlines your imports directly into the served ES modules.
- [Dynamic import](https://github.com/denoland/deploy_feedback/issues/1) support
  on Deno Deploy
- [Native CSS modules](https://css-tricks.com/css-modules-the-native-ones/)

**Thank you for going on this journey with us.**

[docs-badge]: https://img.shields.io/github/v/release/exhibitionist-digital/ultra?label=Docs&logo=deno&color=B06892&
[docs]: https://ultrajs.dev/docs&
[actions-badge]: https://img.shields.io/github/workflow/status/exhibitionist-digital/ultra/fmt%20+%20lint?color=000000&logo=github&label=
[actions]: https://github.com/exhibitionist-digital/ultra/actions
