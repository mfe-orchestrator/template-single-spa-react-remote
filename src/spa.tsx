// Entry point of the single-spa application: an ES module exporting the
// bootstrap / mount / unmount / update lifecycles. The root config imports it
// and calls them; the same object also works as a parcel config
// (mountRootParcel(module, { domElement })).
import React from 'react'
import ReactDOMClient from 'react-dom/client'
import singleSpaReact from 'single-spa-react'
import App from './App'
// Inlined as a string and attached only while the application is mounted, so
// its styles leave the page with it.
import styles from './App.css?inline'

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: App,
  errorBoundary: () => <p>example-remote failed to render.</p>
})

const STYLE_ID = 'example-remote-styles'

async function addStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = styles
  document.head.appendChild(style)
}

async function removeStyles() {
  document.getElementById(STYLE_ID)?.remove()
}

export const bootstrap = lifecycles.bootstrap
export const mount = [addStyles, lifecycles.mount]
export const unmount = [lifecycles.unmount, removeStyles]
export const update = lifecycles.update
