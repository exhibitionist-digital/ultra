# 🌌 Ultra 2.0 (Milky Way)

An unopinionated React streaming web-app framework*.

\* If you want to get very meta (not facebook), Ultra can be viewed as a tiny
bridge to utilise native browser features whilst using popular front-end
libraries. 🔥

## What's new

- BYO query/routing/head libraries
- Support for wouter, react-router, react-query, twind
- Native import maps in browser
- API routing
- Overhaul of internal source code

Ultra allows you to write web-apps which massively simplify your tool chain. You
write ESM, we ship ESM. Where we are going, there is no "bundling" (it feels so
2018 just saying that word).

**Does Ultra "ship js"?**

Yes, Ultra creates rich web applications which allow complex client-side
routing, allow components to persist through route changes (media players,
interactive elements, etc).

Our goal is to both write _AND_ ship source code that works the same way on
server/runtime and client. We view the browser as more than just a "target".
Browser is life, and javascript is good.

**Can I use TypeScript and/or JSX?**

If you want.

**What native browser features should we all be using more?**

Unbundled ESM, service workers, universal import maps, cascading style sheets.

**Ultra always has been (and always will be) powered by the following
hot-takes:**

- **ESM** is non-negotiable in {currentYear}
- **SSR** is non-negotiable in {currentYear}
- Bundling is an **anti-pattern** in {currentYear}
- **Data can be requested anywhere, and is accessible on the server, always**
- **Lazy routing with dynamic imports** trumps FS routing
- **Less magic** in tooling and frameworks is a good thing
- **Simplify** your workflow and tech stack at all costs - life is too short
- **Streams** are neat

---

### 👨‍👩‍👧‍👦 Community

We have the [Discord](https://discord.gg/XDC5WxGHb2). Come say 'sup.

### ✨ Wishlist

Here some things we are interested in for the future of JS and/or Ultra:

- React 18 [native ESM exports](https://github.com/facebook/react/issues/11503)
- [ABT: Anything but TypeScript](https://tc39.es/proposal-type-annotations)
- Libraries supporting
  [optimal Javascript module design](https://jaydenseric.com/blog/optimal-javascript-module-design)
- React
  [resources](https://github.com/facebook/react/commit/796d31809b3683083d3b62ccbab4f00dec8ffb1f)
  for streaming head management
- [Native import maps](https://caniuse.com/import-maps) support in Safari
- [Dynamic import](https://github.com/denoland/deploy_feedback/issues/1) support
  on Deno Deploy
- [Native CSS modules](https://css-tricks.com/css-modules-the-native-ones/)
- More and better ESM CDN's
