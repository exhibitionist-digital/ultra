<div align="center">
<br />
<img src="https://ultrajs.dev/ultra.svg" height="250" />
</div>

### Ultra end-to-end testing using Puppeteer

---

End-to-end (e2e) testing files are found in this folder. They contain tests for
a running Ultra application deployed from files in the `workspace/src` folder.
The tests use the
[Deno puppeteer/deno-puppeteer library](https://doc.deno.land/https://deno.land/x/puppeteer@9.0.2/mod.ts),
a fork of the [Node.js puppeteer library](https://pptr.dev/). These Puppeteer
tests run the Chrome browser in headless mode.

### Running the puppeteer tests

In a terminal go to the root folder of this repository and run:

```
deno task e2e
```

These deno-puppeteer tests are run using the
[Deno test runner](https://deno.land/manual/testing) as is done for Deno unit
tests, so the results for a test run will display in the terminal as they would
for a Deno unit test.
