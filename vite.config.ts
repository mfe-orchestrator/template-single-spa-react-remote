import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The packages the root config provides through its import map. They stay bare
// imports in the build output ("import ... from 'react'") and the browser resolves
// them against the host's import map, so this application renders with the host's
// React instead of shipping its own copy. Keep this list in sync with the
// `shared` list of the root config.
const shared = [/^react($|\/)/, /^react-dom($|\/)/]

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    // A single-spa application is an ES module exporting its lifecycles, so it is
    // built in library mode rather than as an HTML app. The output is
    // dist/index.js, a fixed name: that is the entryPoint the marketplace
    // declares. Any lazy chunk is imported relatively ("./chunk-[hash].js"), so it
    // is resolved against the versioned URL the entry was loaded from.
    lib: {
      entry: 'src/spa.tsx',
      formats: ['es'],
      fileName: () => 'index.js'
    },
    rolldownOptions: {
      external: shared
    }
  },
  // `pnpm build && pnpm preview` serves dist/ the way the orchestrator does, so a
  // root config running locally can load http://localhost:4173/index.js.
  preview: {
    port: 4173,
    cors: true
  }
})
