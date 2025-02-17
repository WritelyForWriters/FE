'use client'

import { PropsWithChildren, createContext, useContext, useState } from 'react'

import TabButton from './button/TabButton'
import TabList from './list/TabList'

interface TabContextType {
  activeTab: string
  handleChangeTab: (tab: string) => void
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
}

export function Tab({ defaultTab, children, onChange }: PropsWithChildren<TabProviderProps>) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab)
    onChange?.(tab)
  }

  return (
    <TabContext.Provider value={{ activeTab, handleChangeTab }}>{children}</TabContext.Provider>
  )
}

Tab.List = TabList
Tab.Button = TabButton
