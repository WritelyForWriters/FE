import { ReactNode } from 'react'

import { useAccordionContext } from './Accordion'

interface AccordionBodyProps {
  children: ReactNode
}

export default function AccordionBody({ children }: AccordionBodyProps) {
  const { isOpen } = useAccordionContext()

  return isOpen ? <div id="contents">{children}</div> : null
}
