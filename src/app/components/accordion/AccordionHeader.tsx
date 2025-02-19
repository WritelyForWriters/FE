'use client'

import { PropsWithChildren } from 'react'

import { FaChevronDown, FaChevronUp } from 'react-icons/fa6'

import { useAccordionContext } from './Accordion'

import classNames from 'classnames/bind'

import styles from './Accordion.module.scss'

const cx = classNames.bind(styles)

export default function AccordionHeader({ children }: PropsWithChildren) {
  const { isOpen, toggle } = useAccordionContext()

  return (
    <div className={cx('header')}>
      {children}
      <button onClick={toggle}>
        {isOpen ? <FaChevronUp color="#B3B3B3" /> : <FaChevronDown color="#B3B3B3" />}
      </button>
    </div>
  )
}
