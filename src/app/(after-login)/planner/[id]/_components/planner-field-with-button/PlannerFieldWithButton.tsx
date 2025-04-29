import { ReactNode, useState } from 'react'

import { useFormContext } from 'react-hook-form'

import classNames from 'classnames/bind'

import styles from './PlannerFieldWithButton.module.scss'

const cx = classNames.bind(styles)
interface PlannerFieldWithButtonProps {
  children: ReactNode
  name: string
}

export default function PlannerFieldWithButton({ children, name }: PlannerFieldWithButtonProps) {
  const { getValues, unregister } = useFormContext()
  const [isShow, setIsShow] = useState(getValues(name) === null)

  const removeField = (setter: (v: boolean) => void) => {
    unregister(name)
    setter(false)
  }

  const restoreField = (setter: (v: boolean) => void) => {
    setter(true)
  }

  return (
    <>
      {isShow ? (
        <div className={cx('field-with-button')}>
          {children}
          <button type="button" onClick={() => removeField(setIsShow)}>
            삭제하기
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => restoreField(setIsShow)}>
          추가하기
        </button>
      )}
    </>
  )
}
