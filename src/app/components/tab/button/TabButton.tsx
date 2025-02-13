import { ReactNode } from 'react'

import { useTabContext } from '../TabContext'

import classNames from 'classnames/bind'

import styles from './TabButton.module.scss'

const cx = classNames.bind(styles)

interface TabButtonProps {
  value: string
  children: ReactNode
}

export default function TabButton({ value, children }: TabButtonProps) {
  const { activeTab, handleChangeTab } = useTabContext()

  return (
    <button
      className={cx('button', { active: activeTab === value })}
      onClick={() => handleChangeTab(value)}
      role="tab"
      aria-selected={activeTab === value}
    >
      {children}
    </button>
  )
}
