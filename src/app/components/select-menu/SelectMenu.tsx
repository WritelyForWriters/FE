import { ImageProps } from 'next/image'

import { ReactElement, useCallback } from 'react'

import { useDetectClose } from '@hooks/index'

import styles from './SelectMenu.module.scss'

interface SelectOptionType {
  label: string | ReactElement<ImageProps>
  isActiveOption?: boolean
  handleAction?: () => void
  className?: string
}

interface SelectOptionProps {
  option: SelectOptionType
}

function SelectOption({ option }: SelectOptionProps) {
  const { label, handleAction, isActiveOption = false, className } = option

  const getActiveStyleClass = useCallback((isActive: boolean) => {
    return isActive ? `${styles['is-active']}` : ''
  }, [])

  return (
    <button
      onClick={handleAction}
      className={`${getActiveStyleClass(isActiveOption)} ${className}`}
    >
      {label}
    </button>
  )
}

interface SelectMenuProps {
  options: SelectOptionType[]
  isOpen: boolean
  handleClose: () => void
}

export default function SelectMenu({ isOpen, handleClose, options }: SelectMenuProps) {
  const selectMenuRef = useDetectClose(handleClose)

  return (
    <>
      {isOpen && (
        <div ref={selectMenuRef} className={styles['select-menu']}>
          {options.map((option, index) => (
            <SelectOption key={index} option={option} />
          ))}
        </div>
      )}
    </>
  )
}
