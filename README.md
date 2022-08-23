<div align="center">
<br />
<img src="https://ultrajs.dev/ultra.svg" height="250" />

### Ultra 2.0 (Milky Way)

#### Next-gen React browser/server fluid web-app framework<sup>*</sup>

[![Discord][discord-badge]][discord]
[![GitHub Workflow Status][actions-badge]][actions]
[![Deno module](https://shield.deno.dev/x/ultra)](https://deno.land/x/ultra)
![Deno compatibility](https://shield.deno.dev/deno/^1.24.3)

</div>

\* If you want to get very meta (not facebook), **Ultra** can be viewed as a
tiny bridge to utilise native browser features 🌐 whilst using popular front-end
libraries. 🧰

## 🧙 Start your journey

Here's a basic **Ultra** project to set you on your way.

```sh
deno run -A https://deno.land/x/ultra@v2.0.0-alpha.0/init.ts
```

## ✨ What's new

**Ultra** allows you to write web-apps which massively simplify your tool chain.
You write ESM, we ship ESM. Where we are going, there is no "bundling" (it feels
so 2018 just saying that word).

- Less opinionated, BYO routing, styling, data fetching, and head libraries
- Support for much of the React ecosystem by custom server/client
  controls<sup>**</sup>
- Native import maps in browser 🤖
- Localised import maps for production 🔥
- API routing
- Overhaul of internal source code
- Updated Deno Deploy support

\*\* _Examples include (but not limited to) `react-query` `twind` `emotion`
`stiches` `react-router` `wouter`_ **@__@**

**Does Ultra _'ship js'_?**

Yes, **Ultra** creates rich web applications which allow complex client-side
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

### 🧟 Contributions

The **Ultra** community welcomes outside contributions. See the
[Contributor Guidelines](./CONTRIBUTING.md) for details.

### 🦥 Wishlist

Here some things we are interested in for the future of JS and/or Ultra:

- React [ESM exports](https://github.com/facebook/react/issues/11503)
- [AbTs: Anything but TypeScript](https://tc39.es/proposal-type-annotations)
- Libraries supporting
  [optimal JavaScript module design](https://jaydenseric.com/blog/optimal-javascript-module-design)
- React
  [resources](https://github.com/facebook/react/commit/796d31809b3683083d3b62ccbab4f00dec8ffb1f)
  for streaming head management
- [Native import maps](https://caniuse.com/import-maps) support in Safari
- [Dynamic import](https://github.com/denoland/deploy_feedback/issues/1) support
  on Deno Deploy
- [Native CSS modules](https://css-tricks.com/css-modules-the-native-ones/)
- More and better ESM CDNs

**Thank you for going on this journey with us.**

[docs-badge]: https://img.shields.io/github/v/release/exhibitionist-digital/ultra?label=Docs&logo=deno&color=000000&
[docs]: https://ultrajs.dev/docs
[discord-badge]: https://img.shields.io/discord/956480805088153620?logo=discord&label=Discord&color=000000&&logoColor=ffffff
[discord]: https://discord.gg/XDC5WxGHb2
[actions-badge]: https://img.shields.io/github/workflow/status/exhibitionist-digital/ultra/fmt%20+%20lint?color=000000&logo=github&label=Tests
[actions]: https://github.com/exhibitionist-digital/ultra/actions
