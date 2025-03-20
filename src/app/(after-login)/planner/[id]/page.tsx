'use client'

import { useState } from 'react'

import IndexPannel from '@components/pannel/IndexPannel'
import Tab from '@components/tab/Tab'
import TabButton from '@components/tab/TabButton'

import PlannerActionBar from './_components/planner-action-bar/PlannerActionBar'
import PlannerSynopsisFormContainer from './_components/planner-synopsis-form-container/PlannerSynopsisFormContainer'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

// mock data example
const TABLE_OF_CONTENTS = [
  { id: 'heading1', title: '시놉시스' },
  { id: 'heading2', title: '세계관' },
  { id: 'heading3', title: '등장인물' },
  { id: 'heading4', title: '줄거리' },
]

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState<'synopsis' | 'ideaNote'>('synopsis')

  return (
    <main className={cx('planner')}>
      <PlannerActionBar />

      <div className={cx('planner__tab-wrapper')}>
        <div className={cx('planner__tab')}>
          <Tab defaultTab="시놉시스" size="large">
            <TabButton value="시놉시스" onClick={() => setActiveTab('synopsis')}>
              시놉시스
            </TabButton>
            <TabButton value="아이디어 노트" onClick={() => setActiveTab('ideaNote')}>
              아이디어 노트
            </TabButton>
          </Tab>
        </div>

        {activeTab === 'synopsis' && (
          <div className={cx('planner__index-pannel-wrapper')}>
            <IndexPannel toc={TABLE_OF_CONTENTS} />
          </div>
        )}
      </div>

      <div className={cx('planner__body')}>
        {activeTab === 'synopsis' ? (
          <PlannerSynopsisFormContainer />
        ) : (
          <section>아이디어를 자유롭게 입력해 주세요.</section>
        )}
      </div>
    </main>
  )
}
