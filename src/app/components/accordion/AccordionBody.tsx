import { PropsWithChildren } from 'react'

import { useAccordionContext } from './Accordion'

export default function AccordionBody({ children }: PropsWithChildren) {
  const { isOpen } = useAccordionContext()

  return isOpen ? <div id="contents">{children}</div> : null
}
