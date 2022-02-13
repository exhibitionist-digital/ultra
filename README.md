<div align="center">
<br />
<img src="./workspace/src/ultra.svg" height="250" />

### ULTRA

#### Modern Streaming React Framework

[ultrajs.dev](https://ultrajs.dev)

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
- Deno Deploy support via GitHub Actions
- Fly/Docker support
- [Example projects moved into their own repo](https://github.com/exhibitionist-digital/ultra-examples)
  for easier hacking

---

### v1.0.0 Roadmap (+ Beyond)

As we await the official release of React 18, here some things we are interested
in for the future of Ultra:

- Deno [vendor](https://github.com/denoland/deno/issues/13346): Serve remote
  packages locally
- Vercel support
- React 18 [ESM support](https://github.com/facebook/react/issues/11503)
- Native import maps: Browser support for import maps is still a bit sketchy.
  Instead of using import map polyfills, Ultra inlines your imports directly
  into the served ES modules.
- Simpler alternatives to [esm.sh](https://esm.sh)
- [Dynamic import](https://github.com/denoland/deploy_feedback/issues/1) support
  on Deno Deploy
- [Native CSS modules](https://css-tricks.com/css-modules-the-native-ones/)
- A custom `request` context hook
- Meaningful Puppeteer tests

**Thank you for going on this journey with us.**
