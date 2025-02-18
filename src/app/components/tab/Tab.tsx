'use client'

import { PropsWithChildren, createContext, useContext, useState } from 'react'

import TabButton from './button/TabButton'
import TabList from './list/TabList'

// TODO type
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

interface TabProviderProps {
  defaultTab: string
  onChange?: (tabValue: string) => void
  size?: 'large' | 'medium'
}

export function Tab({
  defaultTab,
  children,
  onChange,
  size = 'medium',
}: PropsWithChildren<TabProviderProps>) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab)
    onChange?.(tab)
  }

  return (
    <TabContext.Provider value={{ activeTab, handleChangeTab, size }}>
      {children}
    </TabContext.Provider>
  )
}

Tab.List = TabList
Tab.Button = TabButton
