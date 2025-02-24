'use client'

import { InputHTMLAttributes, TextareaHTMLAttributes, useEffect, useRef, useState } from 'react'

import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

import TextFieldInput from './TextFieldInput'

import classNames from 'classnames/bind'

import styles from './TextField.module.scss'

const cx = classNames.bind(styles)

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'password'
}

// NOTE(hajae): Input은 개행이 불가능하므로 expand(확장)기능을 사용하기 위해서는 TextArea가 필요
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'expand'
}

type TextFieldProps = {
  name: string
  label: string
  required?: boolean
  helperText?: string
  error?: string
} & (InputProps | TextAreaProps)

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
  const textarea = useRef<HTMLTextAreaElement | null>(null)
  const [isExpand, setIsExpand] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    handleTextareaHeight()
  }

  // NOTE(hajae): textarea 개행될 때 스크롤 resize를 위해.
  // 아래 코드가 없으면 개행시 border와 text가 붙어버림 (padding에 글자가 겹침)
  const handleTextareaHeight = () => {
    if (textarea.current) {
      textarea.current.style.height = 'auto'
      textarea.current.style.height = textarea.current.scrollHeight + 'px'
    }
  }

  const handleClearClick = () => {
    setValue('')
  }

  const handleExpandClick = () => {
    setIsExpand((prev) => !prev)
  }

  useEffect(() => {
    handleTextareaHeight()
  }, [isExpand])

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
            variant={variant}
            name={name}
            value={value as string | undefined}
            handleInputChange={handleInputChange}
            handleClearClick={handleClearClick}
          />
        )}

        {/* Textarea */}
        {variant === 'expand' && (
          <div
            className={cx('text-field__fieldset__wrapper')}
            data-has-value={value ? 'true' : 'false'}
          >
            <textarea
              {...(props as TextAreaProps)}
              name={name}
              ref={textarea}
              className={cx('text-field__fieldset__text-area', {
                'text-field__fieldset__text-area--expand': isExpand,
              })}
              value={value}
              onChange={handleTextareaChange}
              rows={1}
            />
            {isExpand ? (
              <IoIosArrowUp
                size={20}
                className={cx('text-field__fieldset__text-area__icon')}
                onClick={handleExpandClick}
              />
            ) : (
              <IoIosArrowDown
                size={20}
                className={cx('text-field__fieldset__text-area__icon')}
                onClick={handleExpandClick}
              />
            )}
          </div>
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
