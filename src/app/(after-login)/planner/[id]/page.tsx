'use client'

import { useAtom } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { plannerActiveTabAtom } from 'store/plannerAtoms'

import IndexPannel from '@components/pannel/IndexPannel'

import PlannerActionBar from './_components/planner-action-bar/PlannerActionBar'
import PlannerSynopsisFormContainer from './_components/planner-synopsis-form-container/PlannerSynopsisFormContainer'
import PlannerTabs from './_components/planner-tabs/PlannerTabs'
import { PlannerSynopsisFormValues } from './types/plannerSynopsisFormValues'

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
  const [activeTab] = useAtom(plannerActiveTabAtom)
  const methods = useForm<PlannerSynopsisFormValues>()

  return (
    <div className={cx('container')}>
      <PlannerActionBar />
      {/* MEMO(Sohyun): fixed position은 뷰포트 기준으로 포지션닝 되므로, 고정된 크기만큼 margin-top을 주게되면 margin-collapsing 발생으로 
      다른 element 배치가 이상해질 수 있음. 따라서, padding을 주는 방법 또는 fixed 영역과 동일한 크기의 빈 element 배치.
      padding 대신 빈 element를 둔 이유는 패딩으로 콘텐츠 영역이 다른 영역까지 관여하는 것을 방지하기 위함(관심사 분리에 더 적합하다고 판단) */}
      <div className={cx('header-space')}></div>

      <main className={cx('main-section')}>
        {activeTab === 'synopsis' && <IndexPannel toc={TABLE_OF_CONTENTS} />}

        <div className={cx('index-space')}></div>

        <div className={cx('main-section__contents')}>
          <div className={cx('main-section__contents__planner')}>
            <PlannerTabs />

            {/* NOTE(hajae): 정확한 원인은 파악하지 못했지만 heading1(시놉시스 부분)만 
            목차의 아이템 클릭으로 스크롤이 원하는대로 동작하지 않습니다. (fixed된 header와 겹쳐 표시)
            따라서 스크롤을 위한 첫번째 id(heading1)만 tab-space에 정의. */}
            <div
              className={cx('tab-space')}
              id="heading1"
              style={{ scrollMarginTop: '120px' }}
            ></div>

            <FormProvider {...methods}>
              <PlannerSynopsisFormContainer />
            </FormProvider>
          </div>
        </div>
      </main>
    </div>
  )
}
