'use client'

import { PropsWithChildren } from 'react'

import AccordionBody from './AccordionBody/AccordionBody'
import { AccordionProvider } from './AccordionContext'
import AccordionHeader from './AccordionHeader/AccordionHeader'
import styles from './AccordionS.module.scss'

import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface Props {
  gap?: 12 | 16
  fullWidth?: boolean
}

export default function Accordion({ children, gap = 16, fullWidth }: PropsWithChildren<Props>) {
  return (
    <AccordionProvider>
      <div className={cx('container', `gap-${gap}`, { 'full-width': fullWidth })}>{children}</div>
    </AccordionProvider>
  )
}

Accordion.Header = AccordionHeader
Accordion.Body = AccordionBody
