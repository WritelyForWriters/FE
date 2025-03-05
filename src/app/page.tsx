'use client'

import { Provider } from 'jotai'

import DefaultEditor from '@components/editor/DefaultEditor'

// TODO Provider
export default function Home() {
  return (
    <div>
      <main>
        <Provider>
          <DefaultEditor />
        </Provider>
      </main>
      <footer></footer>
    </div>
  )
}
