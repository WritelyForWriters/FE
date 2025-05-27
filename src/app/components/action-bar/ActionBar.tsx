'use client'

import Link from 'next/link'

import { ReactNode } from 'react'

import { amplitude } from 'lib/amplitude'
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
  return (
    <div className={cx('action-bar-wrapper')}>
      <div className={cx('action-bar-inner-container')}>
        <section className={cx('action-bar-action-section')}>
          {/* 홈 버튼 */}
          <Link
            href="/"
            onClick={() => {
              amplitude.track('home_button_click', {
                button_name: '홈',
              })
            }}
          >
            <MdHome size={24} />
          </Link>
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
