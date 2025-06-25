'use client'

import Image from 'next/image'
import { notFound, useRouter } from 'next/navigation'

import { useEffect } from 'react'

import { Identify, identify } from '@amplitude/analytics-browser'
import { useAtomValue } from 'jotai'
import { trackEvent } from 'lib/amplitude'
import { isLoggedInAtom } from 'store/isLoggedInAtom'

import { useGetMeProfile, useGetProductList } from '@hooks/index'

import CardList from './CardList'
import FeedbackCard from './FeedbackCard'

import classNames from 'classnames/bind'

import styles from './Dashboard.module.scss'

const cx = classNames.bind(styles)

export default function Dashboard() {
  const router = useRouter()

  const { data: profile } = useGetMeProfile()
  const { data: productList, isError: isErrorFetchProductList } = useGetProductList()

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

  if (isErrorFetchProductList) {
    return notFound()
  }

  return (
    <main className={cx('dashboard')}>
      {isLoggedIn ? (
        productList && productList.length > 0 ? (
          <div className={cx('dashboard__content')}>
            <h1 className={cx('dashboard__title')}>
              {`${profile?.nickname} 님, 오늘도 집필을 시작해볼까요?`}
            </h1>
            <CardList productList={productList} />
          </div>
        ) : (
          <div className={cx('dashboard__empty')}>
            <Image src="/images/books.png" alt="books" width={300} height={300} />
            <p className={cx('dashboard__message')}>아직 작품이 없어요</p>
          </div>
        )
      ) : (
        <FeedbackCard
          imageSrc="/images/pen.png"
          imageAlt="pen"
          imageWidth={300}
          imageHeight={300}
          title="회원가입 완료!"
          subTitle="이메일을 확인하고 계정을 활성화해 주세요"
          buttonText="로그인하러 가기"
          onClick={() => router.push('/login')}
        />
        // <div className={cx('dashboard__guest')}>
        //   <Image src="/images/pen.png" alt="pen" width={300} height={300} />
        //   <p className={cx('dashboard__message')}>로그인하고 집필을 시작해보세요!</p>
        // </div>
      )}
    </main>
  )
}
