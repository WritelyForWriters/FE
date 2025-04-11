'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { MouseEvent } from 'react'

import { ProductDto } from 'types/products'

import { useGetProductList } from '@hooks/index'

import { formatDate } from '@utils/formatDate'

import classNames from 'classnames/bind'

import styles from './CardList.module.scss'

const cx = classNames.bind(styles)

interface CardItemProps {
  item: ProductDto
}

function CardItem({ item }: CardItemProps) {
  const router = useRouter()
  const { id, title, genre, updatedAt } = item

  const onClickMoveToPlanner = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    router.push(`/planner/${id}`)
  }

  return (
    <Link href={`/workspace/${id}`} key={id}>
      <li className={cx('item')}>
        <div className={cx('item__container')}>
          <h2>{title ? title : '제목 없음'}</h2>
          <p>{genre}</p>
        </div>
        <div className={cx('item__container')}>
          <button onClick={onClickMoveToPlanner}>작품 플래너</button>
          <time>{formatDate(updatedAt)}</time>
        </div>
      </li>
    </Link>
  )
}

interface CardListProps {
  productList: ProductDto[]
}

export default function CardList({ productList }: CardListProps) {
  const { data } = useGetProductList({
    initialData: productList,
  })

  return (
    <ul className={cx('dashboard__contents')}>
      {data?.map((item: ProductDto) => <CardItem key={item.id} item={item} />)}
    </ul>
  )
}
