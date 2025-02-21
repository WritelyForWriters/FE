'use client'

import { InputHTMLAttributes, useState } from 'react'

import classNames from 'classnames/bind'

import styles from './TextField.module.scss'

const cx = classNames.bind(styles)

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  required?: boolean
  helperText?: string
  error?: string
}

const TextField = ({
  name,
  label,
  required = false,
  helperText,
  error,
  ...props
}: TextFieldProps) => {
  const [value, setValue] = useState(props.value || '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
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
        <input
          {...props}
          name={name}
          className={cx('text-field__fieldset__input')}
          value={value}
          onChange={handleChange}
        />
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
