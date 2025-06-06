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
  index?: number
}

function CardItem({ item, index }: CardItemProps) {
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
          <h2>{title ? title : `제목 없음 ${index}`}</h2>
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

interface Products extends ProductDto {
  index?: number
}

export default function CardList({ productList }: CardListProps) {
  const { data } = useGetProductList({
    initialData: productList,
  })

  const untitledProducts = data
    ?.filter((item) => !item.title)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((item, idx) => ({ ...item, index: idx + 1 }))

  const allProducts = data?.map((item) => {
    const match = untitledProducts?.find((untitleProduct) => item.id === untitleProduct.id)
    return match ? { ...item, index: match.index } : item
  })

  return (
    <ul className={cx('dashboard__contents')}>
      {allProducts?.map((item: Products) => (
        <CardItem key={item.id} item={item} index={item.index} />
      ))}
    </ul>
  )
}
