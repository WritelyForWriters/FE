'use client'

import { InputHTMLAttributes, useState } from 'react'

import classNames from 'classnames/bind'

import styles from './TextField.module.scss'

const cx = classNames.bind(styles)

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  required?: boolean
  error?: string
}

const TextField = ({ name, label, required = false, error, ...props }: TextFieldProps) => {
  const [value, setValue] = useState(props.value || '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <div className={cx('text-field')}>
      <section className={cx('text-field__fieldset')}>
        <label
          htmlFor={name}
          className={cx(
            'text-field__fieldset__label',
            value !== '' ? 'text-field__fieldset__label--active' : '',
          )}
        >
          {label}
          {required ? <div className={cx('text-field__fieldset__label--reqired')} /> : ''}
        </label>
        <input
          {...props}
          name={name}
          className={cx('text-field__fieldset__input')}
          value={value}
          onChange={handleChange}
        />
      </section>
      {error && <span className={cx('text-field__error')}>{error}</span>}
      <span className={cx('text-field__helper-text')}>inpo 텍스트</span>
    </div>
  )
}

export default TextField
