'use client'

import { useSetAtom } from 'jotai'
import { trackEvent } from 'lib/amplitude'
import { plannerActiveTabAtom } from 'store/plannerAtoms'

import Tab from '@components/tab/Tab'
import TabButton from '@components/tab/TabButton'

import classNames from 'classnames/bind'

import styles from './PlannerTabs.module.scss'

const cx = classNames.bind(styles)

export default function PlannerTabs() {
  const setPlannerActiveTab = useSetAtom(plannerActiveTabAtom)

  const handleSynopsisTabClick = () => {
    setPlannerActiveTab('synopsis')
    trackEvent('enter_synopsis_tab', {
      button_name: '시놉시스',
    })
  }

  const handleIdeaNoteClick = () => {
    setPlannerActiveTab('ideaNote')
    trackEvent('enter_idea_note_tab', {
      button_name: '아이디어 노트',
    })
  }

  return (
    <div className={cx('tab-wrapper')}>
      <Tab defaultTab="시놉시스" size="large">
        <TabButton value="시놉시스" onClick={handleSynopsisTabClick}>
          시놉시스
        </TabButton>
        <TabButton value="아이디어 노트" onClick={handleIdeaNoteClick}>
          아이디어 노트
        </TabButton>
      </Tab>
    </div>
  )
}
