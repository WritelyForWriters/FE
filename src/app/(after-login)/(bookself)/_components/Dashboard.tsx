import { getMeProfile } from 'services/members/members'
import { ProductDto } from 'types/products'

import classNames from 'classnames/bind'

import styles from './Dashboard.module.scss'

const cx = classNames.bind(styles)

interface DashboardProps {
  productList?: ProductDto[]
}

export default async function Dashboard({ productList }: DashboardProps) {
  const profile = await getMeProfile()

  return (
    <main className={cx('wrapper')}>
      {productList && productList.length > 0 ? (
        <div className={cx('dashboard')}>
          <h1 className={cx('dashboard__title')}>
            {`${profile?.nickname} 님, 오늘도 집필을 시작해볼까요?`}
          </h1>
          <ul className={cx('dashboard__contents')}>
            {productList.map(({ id, title, genre, updatedAt }) => (
              <li key={id} className={cx('dashboard__item')}>
                <div className={cx('item__container')}>
                  <h2>{title ? title : '제목 없음'}</h2>
                  <p>{genre}</p>
                </div>
                <div className={cx('item__container')}>
                  <button>작품 플래너</button>
                  <time>{updatedAt}</time>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>아직 작품이 없어요</div>
      )}
    </main>
  )
}
