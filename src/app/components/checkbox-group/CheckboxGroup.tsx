import { Controller, useFormContext } from 'react-hook-form'

import Checkbox from '@components/checkbox/Checkbox'

type CheckBox = {
  name: string
  label: string
}

interface CheckboxGroupProps {
  checkAllCheckbox: CheckBox
  checkboxes: CheckBox[]
}

export default function CheckboxGroup({ checkAllCheckbox, checkboxes }: CheckboxGroupProps) {
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
          <div>
            <Checkbox
              label={checkAllCheckbox.label}
              name={checkAllCheckbox.name}
              onChange={(e) => handleAllChange(e.target.checked)}
            />

            {checkboxes.map((box) => (
              <Checkbox
                key={box.name}
                label={box.label}
                name={box.name}
                onChange={handleSingleChange}
              />
            ))}
          </div>
        )
      }}
    />
  )
  // const { setValue, getValues } = useFormContext()

  // const handleAllChange = (checked: boolean) => {
  //   const values = getValues()
  //   Object.keys(values).forEach((key) => {
  //     if (key !== allCheckToggleName) {
  //       setValue(key, checked)
  //     }
  //   })
  //   setValue(allCheckToggleName, checked)
  // }

  // const handleSingleChange = () => {
  //   const values = getValues()
  //   const allSelected = Object.keys(values).every(
  //     (key) => key === allCheckToggleName || values[key],
  //   )
  //   setValue(allCheckToggleName, allSelected)
  // }

  // const enhancedChildren = (Array.isArray(children) ? children : [children]).map((child, index) =>
  //   cloneElement(child, {
  //     key: child.props.name || index,
  //     onChange:
  //       child.props.name === allCheckToggleName
  //         ? (e: ChangeEvent<HTMLInputElement>) => handleAllChange(e.target.checked)
  //         : handleSingleChange,
  //   }),
  // )
  // return <div>{enhancedChildren}</div>
}
