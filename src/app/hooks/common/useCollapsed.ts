import { useCallback, useState } from 'react'

export const useCollapsed = (initialValue = false) => {
  const [isOpen, setIsOpen] = useState(initialValue)

  const onOpen = useCallback(() => setIsOpen(true), [])
  const onClose = useCallback(() => setIsOpen(false), [])
  const onToggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
  }
}
