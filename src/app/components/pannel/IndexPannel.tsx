'use client'

import { MouseEvent, useEffect, useState } from 'react'

import Pannel from '@components/pannel/Pannel'

import { useCollapsed } from '@hooks/common/useCollapsed'

import classNames from 'classnames/bind'

import styles from './IndexPannel.module.scss'

const cx = classNames.bind(styles)

interface TocItem {
  id: string
  title: string
}

interface IndexPannelProps {
  toc: TocItem[]
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
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        threshold: [0.1, 0.6],
        // NOTE(hajae): rootMargin must be specified in pixels
        rootMargin: '0px 0px -140px 0px',
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
