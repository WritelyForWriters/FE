'use client'

import { useRouter } from 'next/navigation'

import { MouseEvent } from 'react'

import { useAtomValue } from 'jotai'
import { MdArrowOutward } from 'react-icons/md'
import { productIdAtom } from 'store/productsAtoms'

import FillButton from '@components/buttons/FillButton'
import Pannel from '@components/pannel/Pannel'

import { useCollapsed } from '@hooks/common/useCollapsed'

import classNames from 'classnames/bind'

import styles from './PlannerPannel.module.scss'

const cx = classNames.bind(styles)

// mock data
// const datas = ['시놉시스', '세계관', '등장인물', '줄거리', '아이디어 노트']

export default function PlannerPannel() {
  const productId = useAtomValue(productIdAtom)
  const router = useRouter()

  const { isOpen, onClose, onOpen } = useCollapsed(false)

  const handleCollapsedPannel = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onClose()
  }

  const handleRedirectPlanner = () => {
    router.push(`/planner/${productId}`)
  }

  return (
    <>
      {isOpen ? (
        <Pannel onClick={handleCollapsedPannel} title="작품 플래너">
          {/* <ul className={cx('planner-list')}>
            {datas.map((data) => (
              <PlannerItem key={data} title={data} content={`${data} 내용`} />
            ))}
          </ul> */}
          <h4>정식 버전에서는 작품 플래너의 내용을 이 메뉴에서 볼 수 있습니다.</h4>
          <FillButton
            type="button"
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
            onClick={handleRedirectPlanner}
          >
            작품 플래너 바로가기
          </FillButton>
        </Pannel>
      ) : (
        <button onClick={onOpen} className={cx('container')}>
          작품 플래너
        </button>
      )}
    </>
  )
}
