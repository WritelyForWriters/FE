import { ReactNode } from 'react'

import { SelectOptionType } from 'types/common/selectMenu'

import { useDetectClose } from '@hooks/index'

import styles from './SelectMenu.module.scss'

interface SelectOptionProps {
  option: SelectOptionType
  children: ReactNode
}

function SelectOption({ option, children }: SelectOptionProps) {
  const { handleAction, isActiveOption = false, className } = option

  const getActiveStyleClass = isActiveOption ? `${styles['is-active']}` : ''

  return (
    <button onClick={handleAction} className={`${getActiveStyleClass} ${className}`}>
      {children}
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
