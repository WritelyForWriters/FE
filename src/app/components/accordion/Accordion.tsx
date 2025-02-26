'use client'

import { ReactNode, createContext, useContext } from 'react'

import { useCollapsed } from '@hooks/common/useCollapsed'

import AccordionBody from './AccordionBody'
import AccordionHeader from './AccordionHeader'

import classNames from 'classnames/bind'

import styles from './Accordion.module.scss'

const cx = classNames.bind(styles)

interface AccordionContextType {
  isOpen: boolean
  toggle: () => void
}

const AccordionContext = createContext<AccordionContextType>({
  isOpen: false,
  toggle: () => {},
})

export const useAccordionContext = () => {
  const context = useContext(AccordionContext)

  if (!context) {
    throw new Error('AccordionHeader, AccordionBody 컴포넌트는 Accordion 내부에서 사용해야 합니다.')
  }
  return context
}

interface AccordionProps {
  children: ReactNode
}

export default function Accordion({ children }: AccordionProps) {
  const { isOpen, onToggle } = useCollapsed(false)

  return (
    <AccordionContext.Provider value={{ isOpen, toggle: onToggle }}>
      <div className={cx('container')}>{children}</div>
    </AccordionContext.Provider>
  )
}

Accordion.Header = AccordionHeader
Accordion.Body = AccordionBody
