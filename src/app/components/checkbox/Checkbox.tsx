'use client'

import Image from 'next/image'

import { InputHTMLAttributes, useState } from 'react'

import checkedIcon from '/public/icons/checked.svg'
import uncheckedIcon from '/public/icons/unchecked.svg'

import classNames from 'classnames/bind'

import styles from './Checkbox.module.scss'

const cx = classNames.bind(styles)

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  checked?: boolean
}

export default function Checkbox({ label, checked = false, ...props }: CheckboxProps) {
  const [isChecked, setIsChecked] = useState(checked)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked)

    if (props.onChange) props.onChange(e)
  }

  return (
    <section className={cx('checkbox')}>
      {isChecked ? (
        <Image src={checkedIcon.src} width={20} height={20} alt="unchecked-image" />
      ) : (
        <Image src={uncheckedIcon.src} width={20} height={20} alt="checked-image" />
      )}
      <input
        className={cx('checkbox__input')}
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        {...props}
      />
      <label className={cx('checkbox__label')}>{label}</label>
    </section>
  )
}
