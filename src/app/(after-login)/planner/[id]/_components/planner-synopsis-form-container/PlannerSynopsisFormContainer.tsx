'use client'

import { useParams } from 'next/navigation'

import { useEffect } from 'react'

import { useAtom } from 'jotai'
import { useFormContext } from 'react-hook-form'
import { plannerActiveTabAtom } from 'store/plannerAtoms'

import IndexPannel from '@components/pannel/IndexPannel'

import { usePostPlannerUserModify } from '@hooks/ai-assistant/useAiassistantMutation'
import { usePlannerTemplatesAiAssistant } from '@hooks/products/usePlannerTemplatesAiAssistant'

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
  const params = useParams()
  const productId = params.id as string

  const { setValue, getValues } = useFormContext()
  const { set: setAiAssistants, getType } = usePlannerTemplatesAiAssistant()
  const [activeTab, setActiveTab] = useAtom(plannerActiveTabAtom)
  const { mutateAsync: postPlannerUserModifyAsync, isPending: isUserModifyPending } =
    usePostPlannerUserModify()

  // NOTE(hajae): jotai는 전역상태이기 때문에 메모리에 상태가 살아있어서 아이디어 탭에서 페이지 이동후 다시 돌아올 경우
  // 아이디어 탭이 활성화되어있음. 따라서, 마운트 될때 탭을 초기화하는 과정이 필요.
  useEffect(() => {
    setActiveTab('synopsis')
  }, [])

  const handleManualModification =
    (name: string, section: string) => async (value: string, inputValue: string) => {
      const promptData = {
        productId,
        genre: (
          getValues('synopsis.genre') as {
            label: string
            value: string
          }[]
        )
          .map((genre) => genre.value)
          .join(', '),
        logline: getValues('synopsis.logline'),
        section: section,
        prompt: inputValue,
      }

      try {
        const data = await postPlannerUserModifyAsync(promptData)

        const { id, answer } = data
        if (!id) return false

        const aiType = getType(name)
        setAiAssistants({ name, content: value, isAiModified: true, type: 'wait' })

        if (aiType === 'retry') {
          setValue(name, answer)
        } else {
          setValue(name, [value, answer].filter(Boolean).join('\n'))
        }

        return true
      } catch (err) {
        console.error('fetch user modify error: ', err)
        return false
      }
    }

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
            <PlannerSynopsisForm
              handleManualModification={handleManualModification}
              isPending={isUserModifyPending}
            />
            <PlannerWorldViewForm
              handleManualModification={handleManualModification}
              isPending={isUserModifyPending}
            />
            <PlannerCharacterForm
              handleManualModification={handleManualModification}
              isPending={isUserModifyPending}
            />
            <PlannerPlotForm
              handleManualModification={handleManualModification}
              isPending={isUserModifyPending}
            />
          </>
        ) : (
          <PlannerIdeaNote />
        )}
      </div>
    </form>
  )
}
