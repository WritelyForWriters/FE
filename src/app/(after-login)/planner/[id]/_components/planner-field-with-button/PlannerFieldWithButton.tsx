import { ReactNode, useEffect, useState } from 'react'

import { useFormContext } from 'react-hook-form'

import FillButton from '@components/buttons/FillButton'

import classNames from 'classnames/bind'

import styles from './PlannerFieldWithButton.module.scss'

const cx = classNames.bind(styles)
interface PlannerFieldWithButtonProps {
  children: ReactNode
  name: string
  hasHelperText?: boolean
  isDropdown?: boolean
  onDelete?: () => void
}

export default function PlannerFieldWithButton({
  children,
  name,
  hasHelperText = true,
  isDropdown = false,
  onDelete,
}: PlannerFieldWithButtonProps) {
  const { watch, unregister, register, setValue } = useFormContext()
  const [isShow, setIsShow] = useState(true)
  const [isDeleted, setIsDeleted] = useState(false)
  const initialValue = watch(name)

  // NOTE(hajae): 삭제된 항목은 null로 반환되어 초기 렌더링 시 화면에 표시하지 않는다
  useEffect(() => {
    if (initialValue === null) {
      setIsShow(false)
    } else if (initialValue === '' || initialValue) {
      setIsShow(true)
    } else if (isDropdown && initialValue === undefined && !isDeleted) {
      // NOTE(hajae): Dropdown에 사용되는 데이터는 객체이기에 ''와 같은 빈값을 받을 수 없어 undefined로.
      // null일때는 비표시, undefined일때는 표시
      // 삭제일 경우도 value가 undefined가 되기때문에 삭제시 다시표시됨. 따라서 삭제일때는 비표시하기위해 isDeleted 추가
      setIsShow(true)
    }
  }, [watch, name, isDropdown, initialValue, isDeleted])

  const removeField = (setter: (v: boolean) => void) => {
    setIsDeleted(true)
    setter(false)
    unregister(name)
    if (onDelete) onDelete()
  }

  const restoreField = (setter: (v: boolean) => void) => {
    setIsDeleted(false)
    register(name)
    setValue(name, '')
    setter(true)
  }

  return (
    <div
      className={cx('wrapper', {
        'wrapper--has-helper': hasHelperText,
      })}
    >
      {isShow ? (
        <div className={cx('field-with-button')}>
          {children}
          <div className={cx('field-with-button__delete-button')}>
            <FillButton
              type="button"
              size="small"
              variant="secondary"
              onClick={() => removeField(setIsShow)}
            >
              삭제하기
            </FillButton>
          </div>
        </div>
      ) : (
        <FillButton
          type="button"
          size="small"
          variant="secondary"
          onClick={() => restoreField(setIsShow)}
        >
          삭제된 항목 추가
        </FillButton>
      )}
    </div>
  )
}
