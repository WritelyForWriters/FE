import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'

import Checkbox from '@components/checkbox/Checkbox'

type CheckBox = {
  name: string
  label: string
  options?: RegisterOptions
  helperText?: string
  handleLabelClick?: () => void
}

interface CheckboxGroupProps {
  checkAllCheckbox: CheckBox
  checkboxes: CheckBox[]
  checkboxWrapperClassName?: string
  checkboxClassName?: string
}

/* NOTE(hajae): checkbox 자체는 react-hook-form의 register을 사용했지만 (간단한 input 요소와 적합)
 * 하지만 CheckboxGroup에서 Contorller 사용한 이유는 Controller는 상태를 직접 관리가 필요할때 유용한 하므로
 * 전체 체크를 했을 때 하위 checkbox를 상태를 직접 바꿔야하므로 Controller가 더 작합하여 Controller로 작성 */
export default function CheckboxGroup({
  checkAllCheckbox,
  checkboxes,
  checkboxWrapperClassName,
  checkboxClassName,
}: CheckboxGroupProps) {
  const { control, setValue, getValues } = useFormContext()

  return (
    <Controller
      name={checkAllCheckbox.name}
      control={control}
      render={({ field }) => {
        const handleAllChange = (checked: boolean) => {
          checkboxes.forEach((box) => setValue(box.name, checked))
          field.onChange(checked)
        }

        const handleSingleChange = () => {
          const values = getValues()
          const allChecked = checkboxes.every((box) => values[box.name])
          setValue(checkAllCheckbox.name, allChecked)
        }

        return (
          <div className={checkboxWrapperClassName}>
            <div className={checkboxClassName}>
              <Checkbox
                label={checkAllCheckbox.label}
                name={checkAllCheckbox.name}
                options={checkAllCheckbox.options}
                helperText={checkAllCheckbox.helperText}
                onChange={(e) => handleAllChange(e.target.checked)}
              />
            </div>

            {checkboxes.map((box, index) => (
              <div key={box.name + index} className={checkboxClassName}>
                <Checkbox
                  label={box.label}
                  name={box.name}
                  options={box.options}
                  helperText={box.helperText}
                  onChange={handleSingleChange}
                  onClick={box.handleLabelClick}
                />
              </div>
            ))}
          </div>
        )
      }}
    />
  )
}
