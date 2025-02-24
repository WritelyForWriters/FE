import { ChangeEvent, InputHTMLAttributes, useState } from 'react'

import { BiSolidHide, BiSolidShow } from 'react-icons/bi'
import { IoCloseOutline } from 'react-icons/io5'

import classNames from 'classnames/bind'

import styles from './TextField.module.scss'

const cx = classNames.bind(styles)

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'password'
}

interface TextFieldProps extends InputProps {
  name: string
  value?: string
  handleInputChange?: (e: ChangeEvent<HTMLInputElement>) => void
  handleClearClick?: () => void
}

export default function TextFieldInput({
  variant,
  name,
  value,
  handleInputChange,
  handleClearClick,
  ...props
}: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className={cx('text-field__fieldset__wrapper')} data-has-value={value ? 'true' : 'false'}>
      <input
        {...(props as InputProps)}
        name={name}
        type={variant === 'password' ? (showPassword ? 'text' : 'password') : 'text'}
        className={cx('text-field__fieldset__input')}
        value={value}
        onChange={handleInputChange}
        autoComplete="new-password"
        data-has-value={value ? 'true' : 'false'}
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
