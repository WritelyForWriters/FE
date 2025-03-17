'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import classNames from 'classnames/bind'

import styles from './PlannerTab.module.scss'

const cx = classNames.bind(styles)

const PLANNER_TABS = [
  {
    label: '시놉시스',
    value: 'synopsys',
  },
  {
    label: '아이디어',
    value: 'idea',
  },
]

interface PlannerTabProps {
  tab: string
}

export default function PlannerTab({ tab }: PlannerTabProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const selectedTab = PLANNER_TABS.find((plannerTab) => plannerTab.value === tab) || PLANNER_TABS[0]

  const handleTabClick = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('tab', value)
    router.push(`${pathname}?${newSearchParams.toString()}`)
  }

  return (
    <div className={cx('planner-tab')}>
      {PLANNER_TABS.map((plannerTab) => (
        <div
          key={plannerTab.value}
          onClick={() => handleTabClick(plannerTab.value)}
          className={cx('planner-tab__tab', {
            'planner-tab__tab--active': selectedTab.value === plannerTab.value,
          })}
        >
          {plannerTab.label}
        </div>
      ))}
    </div>
  )
}
