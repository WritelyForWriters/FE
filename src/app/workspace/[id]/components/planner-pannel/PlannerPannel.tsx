'use client'

import { MouseEvent } from 'react'

import { MdArrowOutward } from 'react-icons/md'

import Pannel from '@components/pannel/Pannel'

import { useCollapsed } from '@hooks/common/useCollapsed'

import PlannerItem from './PlannerItem'

import classNames from 'classnames/bind'

import styles from './PlannerPannel.module.scss'

const cx = classNames.bind(styles)

// mock data
const datas = ['시놉시스', '세계관', '등장인물', '줄거리', '아이디어 노트']

export default function PlannerPannel() {
  const { isOpen, onClose, onOpen } = useCollapsed(false)

  const handleCollapsedPannel = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onClose()
  }

  return (
    <>
      {isOpen ? (
        <Pannel onClick={handleCollapsedPannel} title="작품 플래너">
          <ul className={cx('planner-list')}>
            {datas.map((data) => (
              <PlannerItem key={data} title={data} content={`${data} 내용`} />
            ))}
          </ul>

          {/* TODO (디자인) FillButton 사용할 수 있는지 확인 */}
          <button className={cx('planner-button')}>
            작품 플래너바로가기
            <MdArrowOutward size={20} />
          </button>
        </Pannel>
      ) : (
        <button onClick={onOpen} className={cx('container')}>
          작품 플래너
        </button>
      )}
    </>
  )
}
