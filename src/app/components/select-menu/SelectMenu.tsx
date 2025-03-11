import { HTMLAttributes, ReactNode } from 'react'

import { SelectOptionType } from 'types/common/selectMenu'

import { useDetectClose } from '@hooks/index'

import classNames from 'classnames/bind'

import styles from './SelectMenu.module.scss'

const cx = classNames.bind(styles)

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

interface SelectMenuProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  isOpen: boolean
  handleClose: () => void
}

export default function SelectMenu({ isOpen, handleClose, children, ...rest }: SelectMenuProps) {
  const selectMenuRef = useDetectClose(handleClose)

  return (
    <>
      {isOpen && (
        <div ref={selectMenuRef} className={cx('select-menu')} {...rest}>
          {children}
        </div>
      )}
    </>
  )
}

SelectMenu.Option = SelectOption
