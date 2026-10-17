# single-spa & React: remote template

Starter template for the [MFE Orchestrator](https://github.com/mfe-orchestrator): a
[single-spa](https://single-spa.js.org) **application** written in React 19 with
[single-spa-react](https://single-spa.js.org/docs/ecosystem-react). A
[single-spa root config](https://github.com/mfe-orchestrator/template-single-spa-react-host) mounts
it.

The build output is one native ES module that exports the single-spa lifecycles (`bootstrap`,
`mount`, `unmount`, `update`). The same module also works as a **parcel** config.

## Requirements

- Node.js 24 (LTS)
- [pnpm](https://pnpm.io) 12 (pinned through `packageManager`; `corepack enable` picks it up)

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:5173, the application on its own, without single-spa
pnpm typecheck
pnpm build        # dist/index.js
pnpm preview      # serves dist/ on http://localhost:4173 with CORS on
```

`pnpm dev` renders `src/App.tsx` straight into `index.html` through `src/standalone.tsx`, with its
own React, so you can work on the UI without a root config. To try the application inside a root
config, build it and serve `dist/` (`pnpm build && pnpm preview`). That is the same ES module the
orchestrator serves.

## Project structure

```
.
├── index.html          # standalone dev page (pnpm dev only)
├── src/
│   ├── spa.tsx         # build entry: the single-spa lifecycles
│   ├── App.tsx         # root component
│   ├── App.css         # styles, scoped under .example-remote
│   └── standalone.tsx  # standalone dev bootstrap (pnpm dev only)
├── package.json
└── vite.config.ts      # library build, React kept external
```

## Entry point

`pnpm build` writes **`dist/index.js`**, the `entryPoint` that the marketplace entry declares. Its
name is fixed and has no hash, because the orchestrator serves the entry at a path you declare
once. The versioned URL already makes every release a distinct URL.

The entry is an ES module. If you add lazy chunks (`import('./Heavy')`), they are imported
relatively (`./Heavy-[hash].js`), so the browser resolves them against the versioned URL the entry
came from, and one release never loads another release's chunks. Nothing in the build uses an
absolute public path.

Check `dist/index.js` after any change to `vite.config.ts`. A build that puts the entry somewhere
else is broken for the orchestrator.

## Why Vite, in library mode

A single-spa application is a module that exports lifecycles. It is not an HTML page, so it is built
with Vite's library mode as a plain ES module. The single-spa team's own tooling
(create-single-spa) is built on webpack and SystemJS. Vite and native ES modules with an import map
need neither, load in every current browser, and match the other Vite templates of the
orchestrator.

## Shared React: one copy, the root config's

`vite.config.ts` keeps `react`, `react-dom` and their subpaths (`react-dom/client`,
`react/jsx-runtime`) **external**. They stay bare imports in `dist/index.js`:

```js
import e, { useState as t } from "react";
import n from "react-dom/client";
import { Fragment as r, jsx as i, jsxs as a } from "react/jsx-runtime";
```

The browser resolves them through the root config's import map, so this application renders with
the root config's React and ships none of its own: `dist/index.js` is about 10 kB. That is why
`react` and `react-dom` are `peerDependencies` here. They are installed as devDependencies only for
types and for `pnpm dev`.

If you import another React subpath, add it to the root config's `shared` list as well. Otherwise
the browser cannot resolve the bare import.

## The lifecycles

`src/spa.tsx` wraps `App` with `singleSpaReact()` and exports its lifecycles. Two details:

- **Styles follow the application.** `App.css` is imported with `?inline`. `mount` adds it to
  `<head>` as a `<style>` element, and `unmount` removes it. Keep selectors scoped, because the page
  is shared with the root config and every other application.
- **Mount point.** single-spa-react renders into the element that the root config passes as the
  `domElementGetter` (or `domElement`) custom prop. Without one, it creates
  `<div id="single-spa-application:<name>">` itself.

The props single-spa passes (`name`, `singleSpa`, `mountParcel`, custom props) arrive as props of
`App`.

### As a parcel

The module is a valid parcel config, so a root config or another application can mount it
anywhere:

```js
import { mountRootParcel } from 'single-spa'

const parcel = mountRootParcel(await import(/* @vite-ignore */ url), {
  domElement: document.getElementById('somewhere')
})
// later: parcel.unmount()
```

## Deploying

Build and upload `dist/` with
[`mfe-orchestrator/github-action`](https://github.com/mfe-orchestrator/github-action). Pass your
orchestrator API key as a repository **secret**, never as a variable or a literal in a workflow
file, together with the slug of this microfrontend (`example-remote` in the root config template)
and your console URL. The orchestrator serves `dist/` at a versioned URL. The root config gets that
URL from `remoteUrl('example-remote')`.

## License

MIT
