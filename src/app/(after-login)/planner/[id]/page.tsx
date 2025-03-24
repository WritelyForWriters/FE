'use client'

import { useState } from 'react'

import FormWrapper from '@components/form-wrapper/FormWrapper'
import IndexPannel from '@components/pannel/IndexPannel'
import Tab from '@components/tab/Tab'
import TabButton from '@components/tab/TabButton'

import PlannerActionBar from './_components/planner-action-bar/PlannerActionBar'
import PlannerSynopsisFormContainer from './_components/planner-synopsis-form-container/PlannerSynopsisFormContainer'
import { PlannerSynopsisFormValue } from './types/plannerSynopsisFormValue'

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
  const [ideaValue, setIdeaValue] = useState('')

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
            <div className={cx('planner__tab-wrapper')}>
              <Tab defaultTab="시놉시스" size="large">
                <TabButton value="시놉시스" onClick={() => setActiveTab('synopsis')}>
                  시놉시스
                </TabButton>
                <TabButton value="아이디어 노트" onClick={() => setActiveTab('ideaNote')}>
                  아이디어 노트
                </TabButton>
              </Tab>
            </div>

            <div className={cx('tab-space')}></div>

            <FormWrapper<PlannerSynopsisFormValue>
              className={cx('main-section__form', {
                'main-section__form--idea-form': activeTab === 'ideaNote',
              })}
              onSubmit={async () => {}}
            >
              <div className={cx('main-section__form__fields')}>
                {activeTab === 'synopsis' ? (
                  <PlannerSynopsisFormContainer />
                ) : (
                  <textarea
                    className={styles['main-section__form__fields__textarea']}
                    placeholder="아이디어를 자유롭게 입력해 주세요."
                    value={ideaValue}
                    onChange={(e) => setIdeaValue(e.target.value)}
                  />
                )}
              </div>

              {/* NOTE(hajae): Tab 변경시 활성화된 Tab의 필드만 렌더링 되므로 실제 보이는 필드만 submit하게 됨
              따라서 렌더링되지 않는 상태에서 데이터도 유지하면서, onSubmit에서 둘 다 포함할 수 있도록 추가 */}
              <input type="hidden" name="idea" value={ideaValue} />
            </FormWrapper>
          </div>
        </div>
      </main>
    </div>
  )
}
