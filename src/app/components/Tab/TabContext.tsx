'use client'

import { PropsWithChildren, createContext, useContext, useState } from 'react'

const TabContext = createContext<{
  activeTab: string
  handleChangeTab: (tab: string) => void
}>({
  activeTab: '',
  handleChangeTab: () => {},
})

export function useTabContext() {
  return useContext(TabContext)
}

interface Props {
  defaultTab: string
  onChange?: (tabValue: string) => void
}

export function TabProvider({ defaultTab, children, onChange }: PropsWithChildren<Props>) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab)
    onChange?.(tab)
  }

  return (
    <TabContext.Provider value={{ activeTab, handleChangeTab }}>{children}</TabContext.Provider>
  )
}
