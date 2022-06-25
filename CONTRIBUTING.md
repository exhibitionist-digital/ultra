# Contributor Guidelines

## Developer Setup

The easiest way to work on Ultra is to clone this repo and navigate to the
`/workspace` directory. It contains a simple webapp that imports Ultra from a
relative URL, so it can be used to test changes to the Ultra codebase.

- `cd workspace`
- `deno task dev`

---

## Development Standards

### Pull Requests

Before submitting a PR make sure that the following commands are run without
error:

```
deno fmt
deno lint
deno task test
deno task test:puppeteer
```

Note that `deno fmt` needs to be run on any changes to markdown or other
non-source code files.

The name or description of a Pull Request should be prefixed (pre-appended) with
one of the following tokens (adapted from the
[Conventional Commits standard](https://www.conventionalcommits.org/en/v1.0.0/)):

1. **feat:** - PR is a new Ultra feature.
2. **fix:** - PR is a bug fix.
3. **doc:** - PR is a documentation change.
4. **test:** - PR contains only unit and/or end-to-end tests.
5. **chore:** - PR involves code cleanup or minor changes.
6. **style:** - PR involves formatting or linting changes.
7. **refactor:** - PR contains code refactoring.

Please note:

- The prefix token must be followed by a colon (:).
- Add an exclamation point (!) before the colon if the PR contains a breaking
  change.
- An optional one-word scope indicator may be added in parentheses prior to the
  colon (and the '!' if used).s

Note that a PR might contain code that covers a number of overlapping areas,
such as one involving a new feature and containing tests. Select the prefix that
encompasses the majority of the PR's code.

Although not required, it is a good idea to prefix commit descriptions too.

Here are some PR naming examples with a proper prefix ():

```
feat: Add CSS compression
fix: End-to-end test fixes
doc(contrib): Update contributor guidelines
chore(build): Update Deno version
refactor!: Convert Ultra to Angular
```

Naming PRs in this fashion will help in the creation of release notes.

### Coding Style

Our coding style standard follows the
[Deno style guide](https://deno.land/manual/contributing/style_guide.md) (DSG).
Please pay particular attention to the following style guide items:

- JSDoc-style descriptions (C-style comments) should be added to all exported
  functions (see
  https://deno.land/manual/contributing/style_guide.md#use-jsdoc-for-exported-symbols).
- Unit tests are required for each module and test names should be explicit (see
  https://deno.land/manual/contributing/style_guide.md#each-module-should-come-with-a-test-module).
- Top level functions should not use arrow syntax (See
  https://deno.land/manual/contributing/style_guide.md#top-level-functions-should-not-use-arrow-syntax).
- Exported functions should not have more than 2 arguments; put the rest into an
  options object (see
  https://deno.land/manual/contributing/style_guide.md#exported-functions-max-2-args-put-the-rest-into-an-options-object).
- Export all interfaces that are used as parameters to an exported member (see
  https://deno.land/manual/contributing/style_guide.md#export-all-interfaces-that-are-used-as-parameters-to-an-exported-member)

---

## Discord

While we encourage new contributions, it's a good idea propose a code change or
new feature on [Discord](https://discord.gg/XDC5WxGHb2) before you start
development.

---

## VSCode Configuration

This repo has VSCode editor configs to help when working on this project. They
are found in the `.devcontainer` and `.vscode` folders.

If there is a simple config that doesn't conflict with other tooling and makes
your life easier, feel free to open a PR with it.
