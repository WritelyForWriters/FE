import MainHeader from '(after-login)/(bookself)/_components/MainHeader'
import { nickname, products } from 'mockData'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

/**
 * TODO
 * [ ] 내 정보 조회 API 연결
 * [x] 작품 생성 API 연결
 * [ ] 작품 목록 조회 API 연결
 * [ ] 인가
 */

export default function Home() {
  return (
    <div>
      <MainHeader />

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
