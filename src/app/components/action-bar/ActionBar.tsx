'use client'

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
  // 홈 버튼 클릭 트리거 이벤트
  const handleHomeClick = () => {
    alert('내 서재로 이동합니다.')
  }

  return (
    <div className={cx('action-bar-wrapper')}>
      <div className={cx('action-bar-inner-container')}>
        <section className={cx('action-bar-action-section')}>
          {/* 홈 버튼 */}
          <button onClick={handleHomeClick}>
            <MdHome size={24}></MdHome>
          </button>
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
