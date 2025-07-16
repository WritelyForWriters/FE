'use client'

/**
 * 내 서재 튜토리얼 배경
 * @author 선우
 */
import Image from 'next/image'

import FillButton from '@components/buttons/FillButton'
import TextButton from '@components/buttons/TextButton'
import SelectMenu from '@components/select-menu/SelectMenu'

import { useCollapsed } from '@hooks/common/useCollapsed'

import { formatDate } from '@utils/formatDate'

import classNames from 'classnames/bind'

import styles from './LibraryBackground.module.scss'

const cx = classNames.bind(styles)

const productList = Array.from({ length: 26 }, (_, i) => ({
  id: i + 1 + '',
  title: '타이틀',
  genre: '장르',
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
}))

export default function LibraryBackground() {
  const { isOpen, onToggle, onClose } = useCollapsed()

  return (
    <>
      <header className={cx('header')}>
        <div className={cx('inner-container')}>
          <Image src="/images/logo.png" width={89} height={16} alt="로고" />
          <section className={cx('inner-container__buttons')}>
            <TextButton
              size="large"
              style={{
                display: 'inline',
                marginRight: '1.6rem',
              }}
            >
              로그아웃
            </TextButton>
            <FillButton
              className="library-step-1"
              size="medium"
              style={{
                display: 'inline',
              }}
              onClick={() => onToggle()}
            >
              글쓰기
            </FillButton>
            <SelectMenu handleClose={onClose} isOpen={isOpen} style={{ width: '109px' }}>
              <SelectMenu.Option
                option={{
                  className: 'library-step-2',
                }}
              >
                바로 집필하기
              </SelectMenu.Option>
              <SelectMenu.Option
                option={{
                  className: 'library-step-3',
                }}
              >
                작품 기획하기
              </SelectMenu.Option>
            </SelectMenu>
          </section>
        </div>
      </header>
      <main className={cx('dashboard')}>
        <div className={cx('dashboard__content')}>
          <h1 className={cx('dashboard__title')}>닉네임님, 오늘도 집필을 시작해볼까요?</h1>
          <ul className={cx('dashboard__contents')}>
            {productList.map(({ id, title, genre, updatedAt }) => (
              <li key={id} className={cx(['item', 'library-step-4'])}>
                <div className={cx('item__container')}>
                  <h2>{title}</h2>
                  <p>{genre}</p>
                </div>
                <div className={cx('item__container')}>
                  <button className="library-step-5">작품 플래너</button>
                  <time>{formatDate(updatedAt)}</time>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  )
}
