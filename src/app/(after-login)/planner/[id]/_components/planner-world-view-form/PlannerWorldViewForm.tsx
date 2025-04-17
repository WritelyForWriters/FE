import { useEffect, useState } from 'react'

import { PLANNER_WORLD_VIEW_ITEMS } from 'constants/planner/plannerConstants'

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

  useEffect(() => {
    setCustomFields([{ id: '', name: '', content: '' }])
  }, [])

  const handleAddCustomField = () => {
    setCustomFields((prev) => [...prev, { id: '', name: '', content: '' }])
  }

  return (
    <div className={cx('world-view-form')} id="heading2">
      <div className={cx('world-view-form__title')}>세계관</div>
      {PLANNER_WORLD_VIEW_ITEMS.map((item, index) => (
        <TextField
          key={`planner-world-view-item-${index}`}
          name={`worldview.${item.name}`}
          label={item.label}
          variant="expand"
          helperText={item.helperText}
        />
      ))}
      {customFields.map((field, index) => (
        <TextField
          key={field.id}
          name={`worldview.customFields[${index}].content`}
          label="커스텀 항목"
          variant="expand"
          labelName={`worldview.customFields[${index}].name`}
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
