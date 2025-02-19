import { useTabContext } from '@components/tab/Tab'

import classNames from 'classnames/bind'

import styles from './TabButton.module.scss'

const cx = classNames.bind(styles)

interface TabButtonProps {
  value: string
  children: string
  onClick?: () => void
}

export default function TabButton({ children, onClick, value }: TabButtonProps) {
  const { activeTab, size, handleChangeTab } = useTabContext()

  const handleClickTab = () => {
    handleChangeTab(value)
    onClick?.()
  }

  return (
    <button
      className={cx(`${size}`, { active: activeTab === value })}
      onClick={handleClickTab}
      role="tab"
      aria-selected={activeTab === value}
    >
      {children}
    </button>
  )
}
