'use client'

import { useAccordionContext } from '@components/Accordion/AccordionContext'

interface Props {
  children: (isOpen: boolean, setIsOpen: (isOpen: boolean) => void) => React.ReactNode
}
export default function AccordionHeader({ children }: Props) {
  const { isOpen, setIsOpen } = useAccordionContext()

  return <>{children(isOpen, setIsOpen)}</>
}
