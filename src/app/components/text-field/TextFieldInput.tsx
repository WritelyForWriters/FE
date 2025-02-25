import { InputHTMLAttributes, useState } from 'react'

import { RegisterOptions, useFormContext } from 'react-hook-form'
import { BiSolidHide, BiSolidShow } from 'react-icons/bi'
import { IoCloseOutline } from 'react-icons/io5'

import classNames from 'classnames/bind'

import styles from './TextField.module.scss'

const cx = classNames.bind(styles)

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  variant?: 'default' | 'password'
  validation?: RegisterOptions
}

export default function TextFieldInput({ name, variant, validation, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const { register, watch, setValue } = useFormContext()
  const value = watch(name)

  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev)
  }

  const handleClearClick = () => {
    setValue(name, '')
  }

  return (
    <div className={cx('text-field__fieldset__wrapper')}>
      <input
        {...register(name, validation)}
        type={variant === 'password' ? (showPassword ? 'text' : 'password') : 'text'}
        className={cx('text-field__fieldset__input')}
        autoComplete="new-password"
        data-has-value={value ? 'true' : 'false'}
        {...props}
      />
      {variant === 'default' && value && (
        <IoCloseOutline
          size={20}
          className={cx('text-field__fieldset__input__icon')}
          onClick={handleClearClick}
        />
      )}
      {variant === 'password' &&
        (!showPassword ? (
          <BiSolidShow
            size={20}
            className={cx('text-field__fieldset__input__icon')}
            onClick={handlePasswordToggle}
          />
        ) : (
          <BiSolidHide
            size={20}
            className={cx('text-field__fieldset__input__icon')}
            onClick={handlePasswordToggle}
          />
        ))}
    </div>
  )
}
