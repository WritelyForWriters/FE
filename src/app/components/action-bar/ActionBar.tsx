'use client'

import { MdHome } from 'react-icons/md'

import FillButton from '@components/Buttons/FillButton'

import classNames from 'classnames/bind'

import styles from './ActionBar.module.scss'

const cx = classNames.bind(styles)

interface ActionBarProps {
  usage: 'workspace' | 'planner'
}

export default function ActionBar({ usage }: ActionBarProps) {
  const handleHomeClick = () => {
    alert('내 서재로 이동합니다.')
  }

  return (
    <div className={cx('.action-bar-wrapper')}>
      <div className={cx('action-bar-inner-container')}>
        <section className={cx('action-bar-action-section')}>
          {/* 홈 버튼 */}
          <button onClick={handleHomeClick}>
            <MdHome size={24}></MdHome>
          </button>
        </section>
        <section className={cx('action-bar-info-section')}>
          <section className={cx('title')}>타이틀</section>
        </section>
        <section className={cx('.action-bar-extra-action-section')}>
          {usage === 'workspace' ? <></> : <FillButton size="large">집필하러 가기</FillButton>}
        </section>
      </div>
    </div>
  )
}
