import { nickname, products } from 'mockData'

import FillButton from '@components/buttons/FillButton'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

export default function Home() {
  return (
    <div>
      <header className={cx('header')}>
        <div>로고</div>
        <FillButton size="medium">글쓰기</FillButton>
      </header>

      <main className={cx('wrapper')}>
        <div className={cx('dashboard')}>
          <h1 className={cx('dashboard__title')}>
            {`${nickname} 님, 오늘도 집필을 시작해볼까요?`}
          </h1>
          <ul className={cx('dashboard__contents')}>
            {products.map((product) => (
              <li key={product.id} className={cx('dashboard__item')}>
                <div className={cx('item__container')}>
                  <h2>{product.title}</h2>
                  <p>{product.genre}</p>
                </div>
                <div className={cx('item__container')}>
                  <button>작품 플래너</button>
                  <time>{product.updatedAt}</time>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
