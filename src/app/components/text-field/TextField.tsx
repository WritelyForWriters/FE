'use client'

import { InputHTMLAttributes, useState } from 'react'

import classNames from 'classnames/bind'

import styles from './TextField.module.scss'

const cx = classNames.bind(styles)

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  error?: string
}

const TextField = ({ name, label, error, ...props }: TextFieldProps) => {
  const [value, setValue] = useState(props.value || '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <div className={cx('text-field')}>
      <fieldset className={cx('text-field__fieldset')}>
        <legend className={cx('text-field__fieldset__legend')}>{label}</legend>
        <label
          htmlFor={name}
          className={cx(
            'text-field__fieldset__label',
            value !== '' ? 'text-field__fieldset__label--active' : '',
          )}
        >
          {label}
        </label>
        <input
          {...props}
          name={name}
          className={cx('text-field__fieldset__input')}
          value={value}
          onChange={handleChange}
        />
      </fieldset>
      {error && <span className={cx('text-field__error')}>{error}</span>}
      <span className={cx('text-field__helper-text')}>helper</span>
    </div>
  )
}

export default TextField
