'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { PLANNER_TABS, PlannerTabType } from 'constants/planner/plannerConstants'

import classNames from 'classnames/bind'

import styles from './PlannerTab.module.scss'

const cx = classNames.bind(styles)

interface PlannerTabProps {
  selectedTab: PlannerTabType
}

export default function PlannerTab({ selectedTab }: PlannerTabProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

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
