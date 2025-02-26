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
}

export default function Checkbox({ label, name, options, ...props }: CheckboxProps) {
  const { register, watch } = useFormContext()
  const checked = watch(name) ?? false

  return (
    <section className={cx('checkbox')}>
      <Image
        src={checked ? checkedIcon.src : uncheckedIcon.src}
        width={20}
        height={20}
        alt={checked ? 'checked' : 'unchecked'}
      />
      <input
        className={cx('checkbox__input')}
        type="checkbox"
        checked={checked}
        {...props}
        {...register(name, options)}
      />
      <label className={cx('checkbox__label')}>{label}</label>
    </section>
  )
}
