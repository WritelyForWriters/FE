'use client'

import { MouseEvent, useState } from 'react'

import Pannel from '@components/pannel/Pannel'

import PlannerItem from './PlannerItem'

import classNames from 'classnames/bind'

import styles from './PlannerPannel.module.scss'

const cx = classNames.bind(styles)

// mock data
const datas = ['시놉시스', '세계관', '등장인물', '줄거리', '아이디어 노트']

export default function PlannerPannel() {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCollapsedPannel = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsExpanded(false)
  }

  return (
    <>
      {isExpanded ? (
        <Pannel onClick={handleCollapsedPannel} title="작품 플래너">
          <ul className={cx('planner-list')}>
            {datas.map((data) => (
              <PlannerItem key={data} title={data} content={`${data} 내용`} />
            ))}
          </ul>
        </Pannel>
      ) : (
        // TODO 공통 버튼 컴포넌트로 변경
        <button onClick={() => setIsExpanded(true)} className={cx('container')}>
          작품 플래너
        </button>
      )}
    </>
  )
}
