import { HTMLAttributes, ReactNode } from 'react'

import { SelectOptionType } from 'types/common/selectMenu'

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
    <button type="button" onClick={handleAction} className={`${getActiveStyleClass} ${className}`}>
      {children}
    </button>
  )
}

interface SelectMenuProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

// 외부 감지 필요없이 SelectMenu UI만 보여주는 컴포넌트로 SelectMenu와 구분
export default function SelectMenuContent({ children, ...rest }: SelectMenuProps) {
  return (
    <div className={cx('select-menu')} {...rest}>
      {children}
    </div>
  )
}

SelectMenuContent.Option = SelectOption
