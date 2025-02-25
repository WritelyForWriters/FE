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
    watch,
    formState: { errors },
  } = useFormContext()

  const error = errors[name] as FieldError

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const fieldValue = watch(name)

  return (
    <>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field }) => (
          <div className={cx('container')}>
            <Select
              {...field}
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
              onChange={(selectedOption) => {
                field.onChange(selectedOption)
              }}
              onMenuOpen={() => setIsMenuOpen(true)}
              onMenuClose={() => setIsMenuOpen(false)}
              value={field.value}
              isMulti={isMulti}
              closeMenuOnSelect={!isMulti}
              hideSelectedOptions={false}
              components={{
                MultiValueRemove,
              }}
              menuPortalTarget={document.getElementById('root-modal')}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
            />
            {(isMenuOpen || fieldValue?.length !== 0) && (
              <label className={cx('label', isRequired && 'required')}>{label}</label>
            )}
          </div>
        )}
      />

      {error && <span className={cx('error-message')}>{error.message}</span>}
    </>
  )
}
