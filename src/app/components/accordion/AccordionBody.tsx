import { PropsWithChildren } from 'react'

import { useAccordionContext } from '@components/accordion/AccordionContext'

export default function AccordionBody({ children }: PropsWithChildren) {
  const { isOpen } = useAccordionContext()

  return isOpen ? <div>{children}</div> : null
}
