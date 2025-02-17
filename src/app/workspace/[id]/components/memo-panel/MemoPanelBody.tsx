import Tab from '@components/tab/Tab'

import MemoList from './MemoList'

export default function MemoPanelBody() {
  return (
    <Tab defaultTab="ing">
      <Tab.List>
        <Tab.Button value="ing">진행중</Tab.Button>
        <Tab.Button value="all">전체</Tab.Button>
      </Tab.List>
      <Tab.Panel value="ing">
        <MemoList status="ing" />
      </Tab.Panel>
      <Tab.Panel value="all">
        <MemoList status="all" />
      </Tab.Panel>
    </Tab>
  )
}
