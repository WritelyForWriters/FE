'use client'

import { PropsWithChildren } from 'react'

import TabButton from './TabButton/TabButton'
import { TabProvider } from './TabContext'
import TabList from './TabList/TabList'
import TabPanel from './TabPanel/TabPanel'

interface TabProps {
  defaultTab: string
  onChange?: (tab: string) => void
}

export default function Tab({ defaultTab, children, onChange }: PropsWithChildren<TabProps>) {
  return (
    <TabProvider defaultTab={defaultTab} onChange={onChange}>
      {children}
    </TabProvider>
  )
}

Tab.List = TabList
Tab.Button = TabButton
Tab.Panel = TabPanel
