import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import FillButton from '@components/buttons/FillButton'
import Portal from '@components/modal/Portal'

import classNames from 'classnames/bind'

import styles from './WorkspaceSlider.module.scss'

const cx = classNames.bind(styles)

// TODO 모달 컴포넌트랑 분리
export default function WorkspaceSlider() {
  return (
    <Portal>
      <section className={cx('modal-overlay')}>
        <div className={cx('modal-card')}>
          <Swiper
            modules={[Pagination]}
            // spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            style={{ width: '100%', height: '200px', borderRadius: '1rem' }}
          >
            <SwiperSlide>
              <div style={{ background: '#C4C4C4', height: '100%' }}>슬라이드 1</div>
            </SwiperSlide>
            <SwiperSlide>
              <div style={{ background: '#C4C4C4', height: '100%' }}>슬라이드 2</div>
            </SwiperSlide>
            <SwiperSlide>
              <div style={{ background: '#C4C4C4', height: '100%' }}>슬라이드 3</div>
            </SwiperSlide>
            <SwiperSlide>
              <div style={{ background: '#C4C4C4', height: '100%' }}>슬라이드 3</div>
            </SwiperSlide>
          </Swiper>

          <section className={cx('modal-card__title')}>
            <h2>툴바 사용하기</h2>
            <p>텍스트를 드래그해서 툴바를 열어보세요.</p>
          </section>
          <section>
            <FillButton size="large" onClick={() => {}} style={{ width: '100%', height: 40 }}>
              시작하기
            </FillButton>
          </section>
        </div>
      </section>
    </Portal>
  )
}
