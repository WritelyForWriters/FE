'use client'

import dynamic from 'next/dynamic'

import { useState } from 'react'

import { Controller, FieldError, RegisterOptions, useFormContext } from 'react-hook-form'
import { IoClose } from 'react-icons/io5'
import { MultiValueRemoveProps, components } from 'react-select'

import classNames from 'classnames/bind'

import styles from './Dropdown.module.scss'

/**
 * 공통 컴포넌트 - Dropdown
 * @author 선우
 */

interface DropdownProps {
  name: string
  type: 'outlined' | 'filled'
  placeholder: string
  label: string
  options: { label: string; value: string | number }[]
  rules?: RegisterOptions
  isRequired?: boolean
  isMulti?: boolean
}

const Select = dynamic(() => import('react-select'), {
  ssr: false,
})

const cx = classNames.bind(styles)

const MultiValueRemove = (props: MultiValueRemoveProps) => {
  return (
    <components.MultiValueRemove {...props}>
      <IoClose size={16} color="#CCCCCC" />
    </components.MultiValueRemove>
  )
}

export default function Dropdown({
  name,
  type,
  placeholder,
  label,
  options,
  rules,
  isRequired = true,
  isMulti = false,
}: DropdownProps) {
  const {
    control,
    formState: { isDirty, errors },
  } = useFormContext()

  const error = errors[name] as FieldError

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  console.log(hasValue)

  return (
    <>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { value, onChange } }) => (
          <>
            <Select
              className={cx(
                'custom-select',
                type,
                isRequired && 'required',
                !isMenuOpen && 'closed',
              )}
              placeholder={!isMenuOpen && placeholder}
              options={options}
              isSearchable={false}
              classNamePrefix="react-select"
              onChange={(e) => {
                onChange(e.value)
                setHasValue(true)
              }}
              onMenuOpen={() => setIsMenuOpen(true)}
              onMenuClose={() => setIsMenuOpen(false)}
              value={options.find((option) => option.value === value)}
              isMulti={isMulti}
              components={{
                MultiValueRemove,
              }}
            />
            {(isMenuOpen || isDirty) && (
              <label className={cx('react-select-label', isRequired && 'required')}>{label}</label>
            )}
          </>
        )}
      />
      {error && <span className={cx('error-message')}>{error.message}</span>}
    </>
  )
}
