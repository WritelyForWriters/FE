'use client'

import IndexPannel from '@components/pannel/IndexPannel'
import Tab from '@components/tab/Tab'
import TabButton from '@components/tab/TabButton'

import PlannerActionBar from './_components/planner-action-bar/PlannerActionBar'

import classNames from 'classnames/bind'

import styles from '../../layout.module.scss'

const cx = classNames.bind(styles)

// mock data example
const TABLE_OF_CONTENTS = [
  { id: 'heading1', title: '시놉시스' },
  { id: 'heading2', title: '세계관' },
  { id: 'heading3', title: '등장인물' },
  { id: 'heading4', title: '줄거리' },
]

export default function PlannerPage() {
  return (
    <>
      <PlannerActionBar />
      {/* MEMO(Sohyun): fixed position은 뷰포트 기준으로 포지션닝 되므로, 고정된 크기만큼 margin-top을 주게되면 margin-collapsing 발생으로 
      다른 element 배치가 이상해질 수 있음. 따라서, padding을 주는 방법 또는 fixed 영역과 동일한 크기의 빈 element 배치.
      padding 대신 빈 element를 둔 이유는 패딩으로 콘텐츠 영역이 다른 영역까지 관여하는 것을 방지하기 위함(관심사 분리에 더 적합하다고 판단) */}
      <div className={cx('header-space')}></div>

      <main className={cx('main-section')}>
        <IndexPannel toc={TABLE_OF_CONTENTS} />

        <div className={cx('index-space')}></div>

        <div className={cx('main-section__contents')}>
          <div className={cx('main-section__contents__planner')}>
            <div className={cx('planner__tab-wrapper')}>
              <Tab defaultTab="시놉시스" size="large">
                <TabButton value="시놉시스">시놉시스</TabButton>
                <TabButton value="아이디어 노트">아이디어 노트</TabButton>
              </Tab>
            </div>

            <div className={cx('tab-space')}></div>

            <div className={cx('planner__fields-wrapper')}>
              <section style={{ height: 300, width: '100%', backgroundColor: 'lightBlue' }}>
                시놉시스
              </section>
              <section style={{ height: 300, width: '100%', backgroundColor: 'lightBlue' }}>
                시놉시스
              </section>
              <section style={{ height: 300, width: '100%', backgroundColor: 'lightBlue' }}>
                시놉시스
              </section>
              <section style={{ height: 300, width: '100%', backgroundColor: 'lightBlue' }}>
                시놉시스
              </section>
              <section style={{ height: 300, width: '100%', backgroundColor: 'lightBlue' }}>
                시놉시스
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
