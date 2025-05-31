'use client'

import { useEffect } from 'react'

import { trackEvent } from 'lib/amplitude'

import { useGetMeProfile, useGetProductList } from '@hooks/index'

import CardList from './CardList'

import classNames from 'classnames/bind'

import styles from './Dashboard.module.scss'

const cx = classNames.bind(styles)

export default function Dashboard() {
  const { data: profile } = useGetMeProfile()
  const { data: productList } = useGetProductList()

  useEffect(() => {
    if (productList) {
      trackEvent('library_view', {
        work_count: productList.length,
      })
    }
  }, [productList])

  return (
    <main className={cx('wrapper')}>
      {productList && productList.length > 0 ? (
        <div className={cx('dashboard')}>
          <h1 className={cx('dashboard__title')}>
            {`${profile?.nickname} 님, 오늘도 집필을 시작해볼까요?`}
          </h1>
          <CardList productList={productList} />
        </div>
      ) : (
        <div>아직 작품이 없어요</div>
      )}
    </main>
  )
}
