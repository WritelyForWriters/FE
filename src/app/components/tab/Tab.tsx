'use client'

import { ReactNode, createContext, useContext, useState } from 'react'

import TabButton from './TabButton'

import classNames from 'classnames/bind'

import styles from './Tab.module.scss'

const cx = classNames.bind(styles)

interface TabContextType {
  activeTab: string
  handleChangeTab: (tab: string) => void
  size?: 'large' | 'medium'
}

const TabContext = createContext<TabContextType>({
  activeTab: '',
  handleChangeTab: () => {},
})

export const useTabContext = () => {
  return useContext(TabContext)
}

interface TabProps {
  defaultTab: string
  size?: 'large' | 'medium'
  children: ReactNode
}

export default function Tab({ defaultTab, children, size = 'medium' }: TabProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <TabContext.Provider value={{ activeTab, handleChangeTab, size }}>
      <div className={cx`${size}`}>{children}</div>
    </TabContext.Provider>
  )
}

Tab.Button = TabButton
