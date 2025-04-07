'use client'

import Image from 'next/image'

import { InputHTMLAttributes } from 'react'

import { RegisterOptions, useFormContext } from 'react-hook-form'

import checkedIcon from '/public/icons/checked.svg'
import uncheckedIcon from '/public/icons/unchecked.svg'

import classNames from 'classnames/bind'

import styles from './Checkbox.module.scss'

const cx = classNames.bind(styles)

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  options?: RegisterOptions
  helperText?: string
  onClick?: () => void
}

export default function Checkbox({
  label,
  name,
  options,
  helperText,
  onChange,
  onClick,
  ...props
}: CheckboxProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext()
  const checked = watch(name) ?? false

  return (
    <div className={cx('checkbox-field')}>
      <section className={cx('checkbox-field__fieldset')}>
        <Image
          src={checked ? checkedIcon.src : uncheckedIcon.src}
          width={20}
          height={20}
          alt={checked ? 'checked' : 'unchecked'}
        />
        <input
          id={name}
          className={cx('checkbox-field__fieldset__input')}
          type="checkbox"
          checked={checked}
          {...props}
          {...register(name, options)}
          onChange={(e) => {
            register(name).onChange(e)
            onChange?.(e)
          }}
        />
        <label className={cx('checkbox-field__fieldset__label')} htmlFor={name} onClick={onClick}>
          {label}
        </label>
      </section>

      {/* Helper Text */}
      {(helperText || errors[name]) && (
        <span
          className={cx('checkbox-field__helper-text', {
            'checkbox-field__helper-text--error': errors[name]?.message,
          })}
        >
          {errors[name]?.message ? (errors[name]?.message as string) : helperText}
        </span>
      )}
    </div>
  )
}
