'use client'

import Tab from '@components/tab/Tab'
import TabButton from '@components/tab/TabButton'

import IndexPannel from './components/index-pannel/IndexPannel'
import PlannerActionBar from './components/planner-action-bar/PlannerActionBar'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

// TODO 패널을 fixed로 고정?
export default function Page() {
  return (
    <div className={cx('container')}>
      <PlannerActionBar />

      <main className={cx('main-section')}>
        <IndexPannel />

        <div className={cx('main-section__contents')}>
          <div className={cx('main-section__contents__wrapper')}>
            <Tab defaultTab="시놉시스" size="large">
              <TabButton value="시놉시스">시놉시스</TabButton>
              <TabButton value="아이디어 노트">아이디어 노트</TabButton>
            </Tab>
            <section>시놉시스</section>
          </div>
        </div>
      </main>
    </div>
  )
}
