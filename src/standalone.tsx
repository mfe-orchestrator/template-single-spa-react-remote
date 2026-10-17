// Only used by `pnpm dev`, to work on the application without a root config.
// It is not part of the build: the build entry is src/spa.tsx.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './App.css'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App name="standalone" />
  </StrictMode>
)
