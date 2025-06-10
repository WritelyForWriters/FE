'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ReactNode } from 'react'

import { MdHome } from 'react-icons/md'

import classNames from 'classnames/bind'

import styles from './ActionBar.module.scss'

const cx = classNames.bind(styles)

interface ActionBarProps {
  actionSection: ReactNode
  titleSection: ReactNode
  extraSection: ReactNode
}

export default function ActionBar({ actionSection, titleSection, extraSection }: ActionBarProps) {
  const isPlanner = usePathname().includes('planner')

  return (
    <div className={cx('action-bar-wrapper')}>
      <div className={cx('action-bar-inner-container')}>
        <section className={cx('action-bar-action-section')}>
          {isPlanner && (
            <Link href="/">
              <MdHome size={24}></MdHome>
            </Link>
          )}
          {actionSection}
        </section>
        <section className={cx('action-bar-info-section')}>
          <section className={cx('title')}>{titleSection}</section>
        </section>
        <section className={cx('action-bar-extra-action-section')}>{extraSection}</section>
      </div>
    </div>
  )
}
