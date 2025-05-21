'use client'

import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

import { RegisterOptions, useFormContext } from 'react-hook-form'

import { usePlannerTemplatesAiAssistant } from '@hooks/products/usePlannerTemplatesAiAssistant'

import TextFieldInput from './TextFieldInput'
import TextFieldLabel from './TextFieldLabel'
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
  helperText?: string
  options?: RegisterOptions
  labelName?: string
  isLabelEditable?: boolean
} & (InputProps | TextareaProps)

export default function TextField({
  name,
  label,
  variant = 'default',
  helperText,
  options,
  labelName,
  isLabelEditable = false,
  ...props
}: TextFieldProps) {
  const { register } = useFormContext()

  const {
    formState: { errors },
  } = useFormContext()
  const { get: getAiAssistants } = usePlannerTemplatesAiAssistant()

  const getIsAiModified = (name: string): boolean => {
    return getAiAssistants(name)?.isAiModified ?? false
  }

  return (
    <div className={cx('text-field')}>
      <section className={cx('text-field__fieldset')}>
        {/* Label */}
        <TextFieldLabel
          name={name}
          label={label}
          options={options}
          labelName={labelName}
          isLabelEditable={isLabelEditable}
          {...props}
        />

        {/* Input */}
        {(variant === 'default' || variant === 'password') && (
          <TextFieldInput
            variant={variant}
            options={options}
            isAiModified={getIsAiModified(name)}
            {...(props as InputProps)}
            {...register(name, options)}
          />
        )}

        {/* Textarea */}
        {variant === 'expand' && (
          <TextFieldTextarea
            options={options}
            isAiModified={getIsAiModified(name)}
            {...(props as TextareaProps)}
            {...register(name, options)}
          />
        )}
      </section>

      {/* Helper Text */}
      {(helperText || (errors[name] && errors[name].message)) && (
        <span
          className={cx('text-field__helper-text', {
            'text-field__helper-text--error': errors[name]?.message,
          })}
        >
          {errors[name]?.message
            ? (errors[name]?.message as string)
            : helperText
              ? helperText.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))
              : undefined}
        </span>
      )}
    </div>
  )
}
