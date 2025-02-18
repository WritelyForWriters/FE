import { PropsWithChildren } from 'react'

import { useAccordionContext } from './Accordion'

import classNames from 'classnames/bind'

import styles from './Accordion.module.scss'

const cx = classNames.bind(styles)

export default function AccordionBody({ children }: PropsWithChildren) {
  const { isOpen } = useAccordionContext()

  return isOpen ? <div className={cx('body')}>{children}</div> : null
}
