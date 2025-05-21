import { useParams } from 'next/navigation'

import { useState } from 'react'

import { postUserModify } from 'api/ai-assistant/aiAssistant'
import {
  PLANNER_SYNOPSIS_GENRES,
  PLANNER_SYNOPSIS_LENGTH,
} from 'constants/planner/plannerConstants'
import { useFormContext } from 'react-hook-form'

import Dropdown from '@components/dropdown/Dropdown'
import TextField from '@components/text-field/TextField'

import PlannerFieldWithButton from '../planner-field-with-button/PlannerFieldWithButton'

import classNames from 'classnames/bind'

import styles from './PlannerSynopsisForm.module.scss'

const cx = classNames.bind(styles)

export default function PlannerSynopsisForm() {
  const params = useParams()
  const productId = params.id as string

  const { setValue } = useFormContext()
  const [manualModi, setMenualMode] = useState<{
    name: string
    content: string
    isAiModified: boolean
  }>()

  const handleManualModification = (name: string) => async (value: string, inputValue: string) => {
    try {
      const response = (await postUserModify({
        productId,
        content: value,
        prompt: inputValue,
      })) as { id: string; answer: string }

      if (response.id) {
        setMenualMode({ name: name, content: value, isAiModified: true })
        setValue(name, response.answer)
        return true
      }

      return false
    } catch (error) {
      console.error('fetch use modify error: ', error)
      return false
    }
  }

  const getIsAiModified = (name: string): boolean => {
    if (manualModi && manualModi.name === name) {
      return manualModi.isAiModified
    }

    return false
  }

  return (
    <div className={cx('synopsis-form')} id="heading1">
      <div className={cx('synopsis-form__title')}>시놉시스</div>
      <Dropdown
        name="synopsis.genre"
        type="outlined"
        placeholder="장르"
        label="장르"
        options={PLANNER_SYNOPSIS_GENRES}
        rules={{
          required: {
            value: true,
            message: '필수 입력 사항입니다.',
          },
        }}
        isMulti={true}
        isRequired={true}
      />
      <PlannerFieldWithButton name="synopsis.length" isDropdown={true} manualModifiable={false}>
        <Dropdown
          name="synopsis.length"
          type="outlined"
          placeholder="분량"
          label="분량"
          options={PLANNER_SYNOPSIS_LENGTH}
          isRequired={false}
        />
      </PlannerFieldWithButton>

      <PlannerFieldWithButton name="synopsis.purpose" manualModifiable={false}>
        <TextField name="synopsis.purpose" label="기획 의도" variant="expand" />
      </PlannerFieldWithButton>

      <TextField
        name="synopsis.logline"
        label="로그 라인"
        variant="expand"
        options={{
          required: { value: true, message: 'required' },
          validate: (value) => {
            if (value.trim() === '') {
              return false
            }
          },
        }}
      />
      <PlannerFieldWithButton
        name="synopsis.example"
        handleManualModification={handleManualModification('synopsis.example')}
      >
        <TextField
          name="synopsis.example"
          label="예시 문장"
          variant="expand"
          isAiModified={getIsAiModified('synopsis.example')}
        />
      </PlannerFieldWithButton>
    </div>
  )
}
