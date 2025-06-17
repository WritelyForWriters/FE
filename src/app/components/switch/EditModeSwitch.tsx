import { HTMLAttributes } from 'react'

import classNames from 'classnames/bind'

import styles from './EditModeSwitch.module.scss'

const cx = classNames.bind(styles)

interface EditModeSwitchProps extends HTMLAttributes<HTMLButtonElement> {
  isSelected: boolean
  disabled?: boolean
}

export default function EditModeSwitch({
  isSelected,
  disabled,
  children,
  ...rest
}: EditModeSwitchProps) {
  return (
    <li>
      <button className={cx(isSelected ? 'selected' : 'default')} disabled={disabled} {...rest}>
        {children}
      </button>
    </li>
  )
}
