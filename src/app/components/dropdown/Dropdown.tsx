'use client'

import dynamic from 'next/dynamic'

import { Controller, FieldError, RegisterOptions, useFormContext } from 'react-hook-form'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'
import { DropdownIndicatorProps, MultiValueRemoveProps, components } from 'react-select'

import { useCollapsed } from '@hooks/common/useCollapsed'

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

  const { isOpen, onClose, onOpen } = useCollapsed(false)

  const fieldValue = watch(name)

  const DropdownIndicator = (props: DropdownIndicatorProps) => {
    const {
      selectProps: { menuIsOpen },
    } = props

    const IconComponent = menuIsOpen ? IoIosArrowUp : IoIosArrowDown

    return (
      <components.DropdownIndicator {...props}>
        <IconComponent size={20} color="#B3B3B3" />
      </components.DropdownIndicator>
    )
  }

  const MultiValueRemove = (props: MultiValueRemoveProps) => {
    return (
      <components.MultiValueRemove {...props}>
        <IoClose size={16} color="#CCCCCC" />
      </components.MultiValueRemove>
    )
  }

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
              className={cx('custom-select', type, isRequired && 'required', !isOpen && 'closed')}
              placeholder={!isOpen && placeholder}
              options={options}
              isSearchable={false}
              classNamePrefix="react-select"
              onChange={(selectedOption) => {
                field.onChange(selectedOption)
              }}
              onMenuOpen={onOpen}
              onMenuClose={onClose}
              value={field.value}
              isMulti={isMulti}
              closeMenuOnSelect={!isMulti}
              hideSelectedOptions={false}
              components={{
                MultiValueRemove,
                DropdownIndicator,
              }}
              menuPosition="fixed"
            />
            {(isOpen || (fieldValue && fieldValue.length !== 0)) && (
              <label className={cx('label', isRequired && 'required')}>{label}</label>
            )}
          </div>
        )}
      />

      {error && <span className={cx('error-message')}>{error.message}</span>}
    </>
  )
}
