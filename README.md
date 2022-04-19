<div align="center">
<br />
<img src="https://ultrajs.dev/ultra.svg" height="250" />

### ULTRA

#### Modern Streaming React Framework

[ultrajs.dev](https://ultrajs.dev)

[![Discord][discord-badge]][discord]
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

### ‼️ v1.0.0 @__@

- Total overhaul of transforms, migration to brand new
  [@swc/wasm-web](https://swc.rs/docs/usage/wasm)!
- Esbuild removed!
- Unfettered support for React 18!
- Tests!
- Example integration with [@mdx-js/mdx](https://mdxjs.com)!
- Improvements to API routes!
- Updated [docs](https://ultrajs.dev/docs)!
- New [website](https://ultrajs.dev)!

Migration notes:

Previous v0.8.0 (and earlier) projects need to update your server import. We
removed the `mod.ts` file for simplicity.

`import ultra from 'https://deno.land/x/ultra/server.ts`

---

### Community

We now have a [Discord](https://discord.gg/9BMpE96CZt). Come say HI.

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

Here some things we are interested in for the future of JS and/or Ultra:

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

[docs-badge]: https://img.shields.io/github/v/release/exhibitionist-digital/ultra?label=Docs&logo=deno&color=000000&
[docs]: https://ultrajs.dev/docs
[discord-badge]: https://img.shields.io/discord/956480805088153620?logo=discord&label=Discord&color=000000&&logoColor=ffffff
[discord]: https://discord.gg/9BMpE96CZt
[actions-badge]: https://img.shields.io/github/workflow/status/exhibitionist-digital/ultra/fmt%20+%20lint?color=000000&logo=github&label=Tests
[actions]: https://github.com/exhibitionist-digital/ultra/actions
