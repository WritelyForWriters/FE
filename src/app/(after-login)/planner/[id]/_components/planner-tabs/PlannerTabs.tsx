'use client'

import { useSetAtom } from 'jotai'
import { plannerActiveTabAtom } from 'store/plannerAtoms'

import Tab from '@components/tab/Tab'
import TabButton from '@components/tab/TabButton'

import classNames from 'classnames/bind'

import styles from './PlannerTabs.module.scss'

const cx = classNames.bind(styles)

export default function PlannerTabs() {
  const setPlannerActiveTab = useSetAtom(plannerActiveTabAtom)
  return (
    <div className={cx('tab-wrapper')}>
      <Tab defaultTab="시놉시스" size="large">
        <TabButton value="시놉시스" onClick={() => setPlannerActiveTab('synopsis')}>
          시놉시스
        </TabButton>
        <TabButton value="아이디어 노트" onClick={() => setPlannerActiveTab('ideaNote')}>
          아이디어 노트
        </TabButton>
      </Tab>
    </div>
  )
}
