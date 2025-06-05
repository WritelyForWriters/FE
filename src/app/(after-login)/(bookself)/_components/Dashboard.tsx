'use client'

import { notFound } from 'next/navigation'

import { useEffect } from 'react'

import { Identify, identify } from '@amplitude/analytics-browser'
import { useAtomValue } from 'jotai'
import { trackEvent } from 'lib/amplitude'
import { isLoggedInAtom } from 'store/isLoggedInAtom'

import { useGetMeProfile, useGetProductList } from '@hooks/index'

import CardList from './CardList'

import classNames from 'classnames/bind'

import styles from './Dashboard.module.scss'

const cx = classNames.bind(styles)

export default function Dashboard() {
  const { data: profile } = useGetMeProfile()
  const { data: productList, isError: errorFetchProductList } = useGetProductList()

  const isLoggedIn = useAtomValue(isLoggedInAtom)

  useEffect(() => {
    if (productList) {
      const workCount = productList.length

      trackEvent('library_view', {
        work_count: workCount,
      })

      const identifyObj = new Identify()
      identifyObj.set('work_count', workCount)
      identify(identifyObj)
    }
  }, [productList])

  if (errorFetchProductList) {
    return notFound()
  }

  return (
    <main className={cx('dashboard')}>
      {isLoggedIn ? (
        // 로그인 && 작품이 있는 경우
        productList && productList.length > 0 ? (
          <div className={cx('dashboard__content')}>
            <h1 className={cx('dashboard__title')}>
              {`${profile?.nickname} 님, 오늘도 집필을 시작해볼까요?`}
            </h1>
            <CardList productList={productList} />
          </div>
        ) : (
          // 로그인 && 작품이 없는 경우
          <div className={cx('dashboard__empty')}>
            {/* // TODO: 이미지 추가 */}
            <div className={cx('dashboard__temporary-box')}></div>
            <p className={cx('dashboard__message')}>아직 작품이 없어요</p>
          </div>
        )
      ) : (
        // 로그인 하지 않은 경우
        <div className={cx('dashboard__guest')}>
          <div className={cx('dashboard__temporary-box')}></div>
          <p className={cx('dashboard__message')}>로그인하고 집필을 시작해보세요!</p>
        </div>
      )}
    </main>
  )
}
