'use client'

import { MouseEvent, useEffect, useState } from 'react'

import { TocItemType } from 'types/common/pannel'

import Pannel from '@components/pannel/Pannel'

import { useCollapsed } from '@hooks/common/useCollapsed'

import classNames from 'classnames/bind'

import styles from './IndexPannel.module.scss'

const cx = classNames.bind(styles)

interface IndexPannelProps {
  toc: TocItemType[]
}

export default function IndexPannel({ toc }: IndexPannelProps) {
  const { isOpen, onClose, onOpen } = useCollapsed(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  const handleCollapsedPannel = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onClose()
  }

  useEffect(() => {
    // NOTE(hajae): IntersectionObserver로 목차 활성화 감지
    // https://developer.mozilla.org/ko/docs/Web/API/IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeadings = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => {
            return (
              // MEMO(Sohyun): 에디터 제목으로 목차 인덱스를 isIntersecting할 시에 여러 개의 요소를 감지하고 있고,
              // 이 중 마지막으로 감지된 요소가 setActiveId에 들어가면서 가장 맨 마지막 제목이 활성화되는 문제가 있음.
              // 따라서, 화면 맨 위(viewport top)로부터 얼마나 떨어져 있는지를 계산하여 뷰포트에서 가장 위에 가까운 heading이 0번 인덱스로 오도록 적용
              (a.target as HTMLElement).getBoundingClientRect().top -
              (b.target as HTMLElement).getBoundingClientRect().top
            )
          })

        // 0번 인덱스에 해당하는 요소만 setActiveId에 들어가도록
        if (visibleHeadings.length > 0) {
          const topHeading = visibleHeadings[0]
          setActiveId(topHeading.target.id)
        }
      },
      {
        rootMargin: `-124px 0px -40% 0px`, // 고정된 헤더 높이만큼 위로올리고, 뷰포트 하단 60% 만큼 유효한 영역으로 설정
        threshold: [0], // 요소가 1픽셀이라도 화면에 보이면 감지
      },
    )

    toc.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => {
      toc.forEach(({ id }) => {
        const element = document.getElementById(id)
        if (element) observer.unobserve(element)
      })
    }
  }, [toc])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={cx('wrapper')}>
      {isOpen ? (
        <Pannel onClick={handleCollapsedPannel} title="목차" variant>
          <ul className={cx('index-list')}>
            {toc.map(({ id, title }) => (
              <li
                key={id}
                className={cx('index-list__item', {
                  'index-list__item--active': activeId === id,
                })}
                onClick={() => scrollToSection(id)}
              >
                {title}
              </li>
            ))}
          </ul>
        </Pannel>
      ) : (
        <button onClick={onOpen} className={cx('container')}>
          목차
        </button>
      )}
    </div>
  )
}
