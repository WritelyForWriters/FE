'use client'

import { PropsWithChildren } from 'react'

import { TabProvider } from './TabContext'
import TabButton from './button/TabButton'
import TabList from './list/TabList'
import TabPanel from './panel/TabPanel'

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
