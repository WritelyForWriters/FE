'use client'

import Image from 'next/image'
import { notFound, useRouter } from 'next/navigation'

import { useEffect } from 'react'

import { Identify, identify } from '@amplitude/analytics-browser'
import { useAtomValue, useSetAtom } from 'jotai'
import { trackEvent } from 'lib/amplitude'
import { isCompleteJoinAtom } from 'store/isCompleteJoinAtom'
import { isLoggedInAtom } from 'store/isLoggedInAtom'
import { isFirstProductAtom } from 'store/tutorialAtoms'

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
  const isCompleteJoin = useAtomValue(isCompleteJoinAtom)
  const setIsFirstProductAtom = useSetAtom(isFirstProductAtom)

  useEffect(() => {
    if (productList) {
      const workCount = productList.length

      trackEvent('library_view', {
        work_count: workCount,
      })

      const identifyObj = new Identify()
      identifyObj.set('work_count', workCount)
      identify(identifyObj)

      setIsFirstProductAtom(workCount === 1)
    }
  }, [productList])

  if (isErrorFetchProductList) {
    return notFound()
  }

  return isLoggedIn ? ( // 로그인한 경우
    productList && productList.length > 0 ? (
      // 작품이 있는 경우
      <main className={cx('dashboard')}>
        <div className={cx('dashboard__content')}>
          <h1 className={cx('dashboard__title')}>
            {`${profile?.nickname} 님, 오늘도 집필을 시작해볼까요?`}
          </h1>
          <CardList productList={productList} />
        </div>
      </main>
    ) : (
      // 작품이 없는 경우
      <main className={cx('inner-wrapper')}>
        <FeedbackCard
          image={<Image src="/images/books.png" alt="books" width={300} height={300} />}
          content="아직 작품이 없어요"
        />
      </main>
    )
  ) : // 로그인하지 않은 경우
  isCompleteJoin ? (
    // 회원가입 완료 후 리다이렉트 됐을 때
    <main className={cx('inner-wrapper')}>
      <FeedbackCard
        image={<Image src="/images/pen.png" alt="pen" width={300} height={300} />}
        title="회원가입 완료!"
        subTitle="이메일을 확인하고 계정을 활성화해 주세요."
        buttonText="로그인하러 가기"
        onClick={() => router.push('/login')}
      />
    </main>
  ) : (
    // 회원가입 전
    <main className={cx('inner-wrapper')}>
      <FeedbackCard
        image={<Image src="/images/pen.png" alt="pen" width={300} height={300} />}
        content="로그인하고 집필을 시작해보세요!"
      />
    </main>
  )
}
