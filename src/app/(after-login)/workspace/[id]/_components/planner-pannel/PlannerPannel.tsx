'use client'

import { MouseEvent, useState } from 'react'

import { trackEvent } from 'lib/amplitude'
import { MdArrowOutward } from 'react-icons/md'

import FillButton from '@components/buttons/FillButton'
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
  const [startTime, setStartTime] = useState<number>(0)

  const handleCollapsedPannel = (e: MouseEvent<HTMLButtonElement>) => {
    trackEvent('panel_close', {
      panel_name: '작품 플래너',
      open_duration: Date.now() - startTime,
    })
    e.stopPropagation()
    onClose()
  }

  const handleButtonClick = () => {
    setStartTime(Date.now())
    trackEvent('panel_open', {
      panel_name: '작품 플래너',
    })
    onOpen()
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

          <FillButton
            size="large"
            variant="secondary"
            iconType={<MdArrowOutward size={20} />}
            iconPosition="trailing"
            style={{
              width: 212,
              color: 'white',
              backgroundColor: '#666666',
              justifyContent: 'space-between',
            }}
          >
            작품 플래너 바로가기
          </FillButton>
        </Pannel>
      ) : (
        <button onClick={handleButtonClick} className={cx('container')}>
          작품 플래너
        </button>
      )}
    </>
  )
}
