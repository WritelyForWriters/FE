'use client'

import { useState } from 'react'

import { useAtom } from 'jotai'
import { plannerActiveTabAtom } from 'store/plannerAtoms'

import IndexPannel from '@components/pannel/IndexPannel'

import PlannerCharacterForm from '../planner-character-form/PlannerCharacterForm'
import PlannerIdeaNote from '../planner-idea-note/PlannerIdeaNote'
import PlannerPlotForm from '../planner-plot-form/PlannerPlotForm'
import PlannerSynopsisForm from '../planner-synopsis-form/PlannerSynopsisForm'
import PlannerWorldViewForm from '../planner-world-view-form/PlannerWorldViewForm'

import classNames from 'classnames/bind'

import styles from './PlannerSynopsisFormContainer.module.scss'

const cx = classNames.bind(styles)

const TABLE_OF_CONTENTS = [
  { id: 'heading1', title: '시놉시스' },
  { id: 'heading2', title: '세계관' },
  { id: 'heading3', title: '등장인물' },
  { id: 'heading4', title: '줄거리' },
]

export default function PlannerSynopsisFormContainer() {
  const [activeTab] = useAtom(plannerActiveTabAtom)
  // TODO(hajae): idea note value 추후 처리
  const [ideaValue] = useState('')

  return (
    <form
      className={cx('form', {
        'form--idea-form': activeTab === 'ideaNote',
      })}
      onSubmit={async () => {}}
    >
      <div className={cx('form__fields')}>
        {activeTab === 'synopsis' ? (
          <>
            <div className={cx('index')}>
              <IndexPannel toc={TABLE_OF_CONTENTS} />
            </div>
            <PlannerSynopsisForm />
            <PlannerWorldViewForm />
            <PlannerCharacterForm />
            <PlannerPlotForm />
          </>
        ) : (
          <PlannerIdeaNote />
        )}
      </div>

      {/* NOTE(hajae): Tab 변경시 활성화된 Tab의 필드만 렌더링 되므로 실제 보이는 필드만 submit하게 됨
      따라서 렌더링되지 않는 상태에서 데이터도 유지하면서, onSubmit에서 둘 다 포함할 수 있도록 추가 */}
      <input type="hidden" name="idea" value={ideaValue} />
    </form>
  )
}
