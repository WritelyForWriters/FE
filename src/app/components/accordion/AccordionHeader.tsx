'use client'

import { ReactNode } from 'react'

import { FaChevronDown, FaChevronUp } from 'react-icons/fa6'

import { useAccordionContext } from './Accordion'

import classNames from 'classnames/bind'

import styles from './Accordion.module.scss'

const cx = classNames.bind(styles)

interface AccordionHeaderProps {
  children: ReactNode
}

export default function AccordionHeader({ children }: AccordionHeaderProps) {
  const { isOpen, toggle } = useAccordionContext()

  return (
    <div className={cx('header')}>
      {children}
      <button aria-controls="contents" aria-expanded={isOpen} onClick={toggle}>
        {isOpen ? <FaChevronUp color="#B3B3B3" /> : <FaChevronDown color="#B3B3B3" />}
      </button>
    </div>
  )
}
