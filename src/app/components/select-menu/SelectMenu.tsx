import { ImageProps } from 'next/image'

import { ReactElement, ReactNode, useCallback } from 'react'

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
  children: ReactNode
  isOpen: boolean
  handleClose: () => void
}

export default function SelectMenu({ isOpen, handleClose, children }: SelectMenuProps) {
  const selectMenuRef = useDetectClose(handleClose)

  return (
    <>
      {isOpen && (
        <div ref={selectMenuRef} className={styles['select-menu']}>
          {children}
        </div>
      )}
    </>
  )
}

SelectMenu.Option = SelectOption
