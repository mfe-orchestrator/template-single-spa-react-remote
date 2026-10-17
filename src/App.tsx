import { useState } from 'react'

export interface AppProps {
  /** Name the application is registered under in the root config. */
  name?: string
}

export default function App({ name }: AppProps) {
  const [count, setCount] = useState(0)

  return (
    <section className="example-remote">
      <h1>Example remote</h1>
      <p>
        A React application mounted by single-spa
        {name ? <> as <code>{name}</code></> : null}.
      </p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        count is {count}
      </button>
    </section>
  )
}
