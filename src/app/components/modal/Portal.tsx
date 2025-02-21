'use client'

import { ReactElement, useEffect, useState } from 'react'

import { createPortal } from 'react-dom'

export default function Portal({ children }: { children: ReactElement }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  return mounted ? createPortal(children, document.getElementById('modal') as HTMLElement) : <></>
}
