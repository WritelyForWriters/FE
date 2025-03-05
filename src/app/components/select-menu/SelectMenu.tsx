import { CSSProperties, ReactNode } from 'react'

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

interface SelectMenuProps {
  children: ReactNode
  isOpen: boolean
  handleClose: () => void
  style?: CSSProperties
}

export default function SelectMenu({ isOpen, handleClose, children, style }: SelectMenuProps) {
  const selectMenuRef = useDetectClose(handleClose)

  return (
    <>
      {isOpen && (
        <div ref={selectMenuRef} className={cx('select-menu')} style={style}>
          {children}
        </div>
      )}
    </>
  )
}

SelectMenu.Option = SelectOption
