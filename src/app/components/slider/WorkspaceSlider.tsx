import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import Portal from '@components/modal/Portal'

import classNames from 'classnames/bind'

import styles from './WorkspaceSlider.module.scss'

const cx = classNames.bind(styles)

export default function WorkspaceSlider() {
  return (
    <Portal>
      <section className={cx('modal-overlay')}>
        <div className={cx('modal-card')}>
          <Swiper
            modules={[Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            style={{ width: '100%', height: '300px' }}
          >
            <SwiperSlide>
              <div style={{ background: '#eee', height: '100%' }}>슬라이드 1</div>
            </SwiperSlide>
            <SwiperSlide>
              <div style={{ background: '#ccc', height: '100%' }}>슬라이드 2</div>
            </SwiperSlide>
            <SwiperSlide>
              <div style={{ background: '#aaa', height: '100%' }}>슬라이드 3</div>
            </SwiperSlide>
            <SwiperSlide>
              <div style={{ background: '#aaa', height: '100%' }}>슬라이드 3</div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>
    </Portal>
  )
}
