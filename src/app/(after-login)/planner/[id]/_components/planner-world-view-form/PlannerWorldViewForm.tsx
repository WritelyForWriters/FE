import { PLANNER_WORLD_VIEW_ITEMS } from 'constants/planner/plannerConstants'
import { useFormContext } from 'react-hook-form'

import TextButton from '@components/buttons/TextButton'
import TextField from '@components/text-field/TextField'

import PlannerFieldWithButton from '../planner-field-with-button/PlannerFieldWithButton'

import classNames from 'classnames/bind'

import styles from './PlannerWorldViewForm.module.scss'

const cx = classNames.bind(styles)

type CustomField = {
  id: string
  name: string
  content: string
}

export default function PlannerWorldViewForm() {
  const { watch, setValue } = useFormContext()
  const customFields: CustomField[] = watch('worldview.customFields') || []

  const handleAddCustomField = () => {
    setValue('worldview.customFields', [...customFields, { id: '', name: '', content: '' }])
  }

  const handleDeleteCustomField = (index: number) => {
    const updated = [...customFields]
    updated.splice(index, 1)
    setValue('worldview.customFields', updated)
  }

  return (
    <div className={cx('world-view-form')} id="heading2">
      <div className={cx('world-view-form__title')}>세계관</div>
      {PLANNER_WORLD_VIEW_ITEMS.map((item, index) => (
        <PlannerFieldWithButton
          key={item.name}
          name={`worldview.${item.name}`}
          hasHelperText={true}
        >
          <TextField
            key={`planner-world-view-item-${index}`}
            name={`worldview.${item.name}`}
            label={item.label}
            variant="expand"
            helperText={item.helperText}
          />
        </PlannerFieldWithButton>
      ))}
      {customFields.map((field, index) => (
        <PlannerFieldWithButton
          key={field.id || index}
          name={`worldview.customFields[${index}]`}
          hasHelperText={false}
          onDelete={() => handleDeleteCustomField(index)}
        >
          <TextField
            name={`worldview.customFields[${index}].content`}
            label="커스텀 항목"
            variant="expand"
            labelName={`worldview.customFields[${index}].name`}
            isLabelEditable={true}
          />
        </PlannerFieldWithButton>
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
