import { ChangeEvent, InputHTMLAttributes, useState } from 'react'

import { RegisterOptions, useFormContext } from 'react-hook-form'
import { BiSolidHide, BiSolidShow } from 'react-icons/bi'
import { IoCloseOutline } from 'react-icons/io5'

import classNames from 'classnames/bind'

import styles from './TextField.module.scss'

const cx = classNames.bind(styles)

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  variant?: 'default' | 'password'
  options?: RegisterOptions
}

export default function TextFieldInput({ name, variant, options, ...props }: InputProps) {
  const { register, watch, setValue } = useFormContext()
  const { onChange: registerOnChange, ...rest } = register(name, options)
  const value = watch(name)

  const [showPassword, setShowPassword] = useState(false)

  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev)
  }

  const handleClearClick = () => {
    setValue(name, '')
  }

  return (
    <div className={cx('text-field__fieldset__wrapper')}>
      <input
        {...rest}
        {...props}
        type={variant === 'password' ? (showPassword ? 'text' : 'password') : 'text'}
        className={cx('text-field__fieldset__input')}
        autoComplete="new-password"
        data-has-value={value ? 'true' : 'false'}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setValue(name, e.target.value)

          if (registerOnChange) registerOnChange(e)
          if (props.onChange) props.onChange(e)
        }}
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
