'use client'

import { InputHTMLAttributes, TextareaHTMLAttributes, useState } from 'react'

import TextFieldInput from './TextFieldInput'
import TextFieldTextarea from './TextFieldTextarea'

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
  required?: boolean
  helperText?: string
  error?: string
} & (InputProps | TextareaProps)

const TextField = ({
  name,
  label,
  variant = 'default',
  required = false,
  helperText,
  error,
  ...props
}: TextFieldProps) => {
  const [value, setValue] = useState(props.value || '')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }

  const handleClearClick = () => {
    setValue('')
  }

  return (
    <div className={cx('text-field')}>
      <section className={cx('text-field__fieldset')}>
        {/* Label */}
        <label
          htmlFor={name}
          className={cx('text-field__fieldset__label', {
            'text-field__fieldset__label--active': value !== '',
          })}
        >
          {label}
          {required ? <div className={cx('text-field__fieldset__label--reqired')} /> : ''}
        </label>

        {/* Input */}
        {(variant === 'default' || variant === 'password') && (
          <TextFieldInput
            {...(props as InputProps)}
            variant={variant}
            name={name}
            value={value as string | undefined}
            handleInputChange={handleInputChange}
            handleClearClick={handleClearClick}
          />
        )}

        {/* Textarea */}
        {variant === 'expand' && (
          <TextFieldTextarea
            {...(props as TextareaProps)}
            value={value as string}
            name={name}
            handleTextareaChange={handleTextareaChange}
          />
        )}
      </section>

      {/* Helper Text */}
      {(helperText || error) && (
        <span
          className={cx('text-field__helper-text', {
            'text-field__helper-text--error': error,
          })}
        >
          {error ? error : helperText}
        </span>
      )}
    </div>
  )
}

export default TextField
