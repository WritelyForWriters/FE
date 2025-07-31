import { useState } from 'react'

import type { Swiper as SwiperClass } from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import classNames from 'classnames/bind'

import styles from './WorkspaceSlider.module.scss'

const cx = classNames.bind(styles)

const slideContents = [
  {
    title: '툴바 사용하기',
    desc: '텍스트를 드래그해서 툴바를 열어보세요.',
  },
  {
    title: 'AI 어시스턴트 사용하기',
    desc: `툴바의 AI 어시스턴트 메뉴에서 다양한\nAI 기능을 사용해보세요.`,
  },
  {
    title: 'AI와 대화하기',
    desc: '화면 하단의 AI 어시스턴트 버튼으로\nAI와 자유롭게 대화할 수 있어요.',
  },
  {
    title: '메모하기',
    desc: '선택한 구간에 대해 메모를 남겨보세요.',
  },
]

export default function WorkspaceSlider() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <>
      <Swiper
        modules={[Pagination]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        style={{ width: '100%', height: '200px', borderRadius: '1rem' }}
        onSlideChange={(swiper: SwiperClass) => setActiveIndex(swiper.activeIndex)}
      >
        <SwiperSlide>
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src="/videos/tutorial_toolbar.mp4" type="video/mp4" />
          </video>
        </SwiperSlide>
        <SwiperSlide>
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src="/videos/tutorial_ai.mp4" type="video/mp4" />
          </video>
        </SwiperSlide>
        <SwiperSlide>
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src="/videos/tutorial_chat.mp4" type="video/mp4" />
          </video>
        </SwiperSlide>
        <SwiperSlide>
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src="/videos/tutorial_memo.mp4" type="video/mp4" />
          </video>
        </SwiperSlide>
      </Swiper>

      <section className={cx('modal-card__title')}>
        <h2>{slideContents[activeIndex].title}</h2>
        <p>{slideContents[activeIndex].desc}</p>
      </section>
    </>
  )
}
