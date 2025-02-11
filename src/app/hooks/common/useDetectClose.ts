import { useEffect, useRef } from 'react'

export const useDetectClose = (onClose: () => void) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: Event) => {
      if (ref.current !== null && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', onClick)

    return () => {
      document.addEventListener('mousedown', onClick)
    }
  }, [onClose])

  return ref
}
