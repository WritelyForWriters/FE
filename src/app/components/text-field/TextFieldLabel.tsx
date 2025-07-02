'use client'

import { CSSProperties, InputHTMLAttributes, TextareaHTMLAttributes, useState } from 'react'

import { RegisterOptions, useFormContext } from 'react-hook-form'

import classNames from 'classnames/bind'

import styles from './TextField.module.scss'

const cx = classNames.bind(styles)

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'password'
}

// NOTE(hajae): Input은 개행이 불가능하므로 expand(확장)기능을 사용하기 위해서는 TextArea가 필요
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'expand'
}

type TextFieldProps = {
  name: string
  label: string
  options?: RegisterOptions
  labelName?: string
  isLabelEditable?: boolean
} & (InputProps | TextareaProps)

export default function TextFieldLabel({
  name,
  label,
  options,
  labelName,
  isLabelEditable = false,
  ...props
}: TextFieldProps) {
  const { register, watch } = useFormContext()
  const value = watch(name)
  const labelValue = watch(labelName || '')
  const [editingLabel, setEditingLabel] = useState(false)

  const handleLabelClick = () => {
    if (isLabelEditable) {
      setEditingLabel(true)
    }
  }

  const handleLabelBlur = () => setEditingLabel(false)

  const handleLabelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setEditingLabel(false)
    }
  }

  const editableLabelStyle: CSSProperties = isLabelEditable
    ? {
        cursor: 'pointer',
        zIndex: '1',
        pointerEvents: 'auto',
      }
    : {}

  return (
    <>
      {editingLabel ? (
        <input
          {...register(labelName!)}
          type="text"
          className={cx('text-field__fieldset__label-input', {
            'text-field__fieldset__label-input--empty': !Boolean(value),
          })}
          name={labelName}
          onBlur={handleLabelBlur}
          onKeyDown={handleLabelKeyDown}
          autoFocus
        />
      ) : (
        <label
          className={cx('text-field__fieldset__label', {
            'text-field__fieldset__label--active': value,
            'text-field__fieldset__label--editable': isLabelEditable,
          })}
          style={editableLabelStyle}
          onClick={handleLabelClick}
        >
          {labelValue || label}
          {props.required || (typeof options?.required === 'object' && options?.required?.value) ? (
            <div className={cx('text-field__fieldset__label--required')} />
          ) : (
            ''
          )}
        </label>
      )}
    </>
  )
}
