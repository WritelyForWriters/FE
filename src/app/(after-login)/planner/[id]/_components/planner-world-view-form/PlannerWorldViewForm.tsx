import { useEffect, useState } from 'react'

import { PLANNER_WORLD_VIEW_ITEMS } from 'constants/planner/plannerConstants'
import { v4 as uuidv4 } from 'uuid'

import TextButton from '@components/buttons/TextButton'
import TextField from '@components/text-field/TextField'

import classNames from 'classnames/bind'

import styles from './PlannerWorldViewForm.module.scss'

const cx = classNames.bind(styles)

type CustomField = {
  id: string
  name: string
  content: string
}

export default function PlannerWorldViewForm() {
  const [customFields, setCustomFields] = useState<CustomField[]>([])

  // NOTE(hajae): uuidv4는 client side에서 실행되는 함수 인데,
  // useState의 초기화할 때(ssr) 사용하면 에러가 발생하므로 최초 마운트 후 커스텀 필드 추가
  useEffect(() => {
    setCustomFields([{ id: uuidv4(), name: '', content: '' }])
  }, [])

  const handleAddCustomField = () => {
    setCustomFields((prev) => [...prev, { id: uuidv4(), name: '', content: '' }])
  }

  return (
    <div className={cx('world-view-form')} id="heading2">
      <div className={cx('world-view-form__title')}>세계관</div>
      {PLANNER_WORLD_VIEW_ITEMS.map((item, index) => (
        <TextField
          key={`planner-world-view-item-${index}`}
          name={`worldView.${item.name}`}
          label={item.label}
          variant="expand"
          helperText={item.helperText}
        />
      ))}
      {customFields.map((field) => (
        <TextField
          key={field.id}
          name={`worldView.customFields[${field.id}].content`}
          label="커스텀 항목"
          variant="expand"
          labelName={`worldView.customFields[${field.id}].name`}
          isLabelEditable={true}
        />
      ))}
      {customFields.length < 15 && (
        <div className={cx('world-view-form__add-custom-field')}>
          <TextButton size="large" type="button" onClick={handleAddCustomField}>
            항목 추가하기
          </TextButton>
        </div>
      )}
    </div>
  )
}
