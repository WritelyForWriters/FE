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
}

export default function PlannerFieldWithButton({
  children,
  name,
  hasHelperText = true,
}: PlannerFieldWithButtonProps) {
  const { watch, unregister, register, setValue } = useFormContext()
  const [isShow, setIsShow] = useState(true)
  const initialValue = watch(name)

  // NOTE(hajae): 삭제된 항목은 null로 반환되어 초기 렌더링 시 화면에 표시하지 않는다
  useEffect(() => {
    if (initialValue === null) {
      setIsShow(false)
    } else if (initialValue === '' || initialValue) {
      setIsShow(true)
    }
  }, [watch, name, initialValue])

  const removeField = (setter: (v: boolean) => void) => {
    unregister(name)
    setter(false)
  }

  const restoreField = (setter: (v: boolean) => void) => {
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
