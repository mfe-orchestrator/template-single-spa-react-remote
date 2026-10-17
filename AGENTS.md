# AGENTS.md

A single-spa application in React 19 for the MFE Orchestrator. A root config mounts it
(template-single-spa-react-host). The build is one ES module that exports single-spa lifecycles.

## Commands

- `pnpm install`: pnpm 12, pinned in `packageManager`. Node 24.
- `pnpm typecheck`: `tsc -b`.
- `pnpm build`: typecheck, then `vite build`. Writes `dist/index.js`.
- `pnpm dev`: standalone page (`index.html` and `src/standalone.tsx`), not the single-spa build.
- `pnpm preview`: serves `dist/` on port 4173 with CORS, so a local root config can import it.

There is no linter and no test suite. `pnpm build` is the check.

## Invariants: do not break these

- **The entry is `dist/index.js`.** The marketplace `entryPoint` points at it. Do not rename it or
  add a hash (`build.lib.fileName` in `vite.config.ts`).
- **The build entry is `src/spa.tsx`**, and it must keep exporting `bootstrap`, `mount` and `unmount`
  (`update` too, for parcels). The root config `import()`s the module and calls these exports.
- **React stays external.** `react`, `react-dom` and their subpaths are in
  `build.rolldownOptions.external` and come from the root config's import map. Bundling them gives
  the page two Reacts. A new React subpath import must also be added to the root config's `shared`
  list. Keep `react` and `react-dom` as `peerDependencies`.
- **No absolute URLs or public paths.** The orchestrator serves each version under its own URL.
  Chunks must stay relative imports.
- **Styles are scoped and mounted with the app.** CSS is imported with `?inline`, added on `mount`
  and removed on `unmount`. Do not add global selectors (`body`, `h1`, `button`) because they would
  leak into the root config.
- Never hardcode a backend URL, project id or remote URL. This repo does not talk to the
  orchestrator; the root config does.

## Layout

- `src/spa.tsx`: lifecycles (singleSpaReact plus the style mount and unmount).
- `src/App.tsx`, `src/App.css`: the UI.
- `src/standalone.tsx`, `index.html`: dev only.
- `vite.config.ts`: library build, externals, preview CORS.
