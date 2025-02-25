'use client'

import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

import { RegisterOptions, useFormContext } from 'react-hook-form'

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
  validation?: RegisterOptions
} & (InputProps | TextareaProps)

export default function TextField({
  name,
  label,
  variant = 'default',
  required = false,
  helperText,
  validation,
  ...props
}: TextFieldProps) {
  const {
    watch,
    formState: { errors },
  } = useFormContext()
  const value = watch(name)

  return (
    <div className={cx('text-field')}>
      <section className={cx('text-field__fieldset')}>
        {/* Label */}
        <label
          htmlFor={name}
          className={cx('text-field__fieldset__label', {
            'text-field__fieldset__label--active': value,
          })}
        >
          {label}
          {required ? <div className={cx('text-field__fieldset__label--reqired')} /> : ''}
        </label>

        {/* Input */}
        {(variant === 'default' || variant === 'password') && (
          <TextFieldInput
            name={name}
            variant={variant}
            validation={validation}
            {...(props as InputProps)}
          />
        )}

        {/* Textarea */}
        {variant === 'expand' && (
          <TextFieldTextarea name={name} validation={validation} {...(props as TextareaProps)} />
        )}
      </section>

      {/* Helper Text */}
      {(helperText || errors) && (
        <span
          className={cx('text-field__helper-text', {
            'text-field__helper-text--error': errors[name]?.message,
          })}
        >
          {errors[name]?.message ? (errors[name]?.message as string) : helperText}
        </span>
      )}
    </div>
  )
}
