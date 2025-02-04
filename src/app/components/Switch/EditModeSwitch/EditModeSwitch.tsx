import { HTMLAttributes, PropsWithChildren } from 'react'

import classNames from 'classnames/bind'

import styles from './EditModeSwitch.module.scss'

const cx = classNames.bind(styles)

interface Props extends HTMLAttributes<HTMLButtonElement> {
  isSelected: boolean
  disabled?: boolean
}

export default function EditModeSwitch({
  isSelected,
  disabled,
  children,
  ...rest
}: PropsWithChildren<Props>) {
  return (
    <li>
      <button className={cx(isSelected ? 'selected' : 'default')} disabled={disabled} {...rest}>
        {children}
      </button>
    </li>
  )
}
