'use client'

import { useRouter } from 'next/navigation'

import { MouseEvent } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { useAtomValue } from 'jotai'
import { MdArrowOutward } from 'react-icons/md'
import { Rnd } from 'react-rnd'
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
        <div style={{ width: '100%', position: 'relative' }}>
          <Rnd
            disableDragging
            bounds="parent"
            enableResizing={{ left: true }}
            minWidth={244}
            style={{
              minWidth: 244,
              right: 0,
              left: 'none',
            }}
            default={{
              width: 244,
              height: 400,
            }}
          >
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.25 }}
                style={{
                  width: '100%',
                  height: 480,
                }}
              >
                <Pannel
                  onClick={handleCollapsedPannel}
                  title="작품 플래너"
                  style={{
                    minHeight: 400,
                    justifyContent: 'space-between',
                  }}
                >
                  {/* <ul className={cx('planner-list')}>
            {datas.map((data) => (
              <PlannerItem key={data} title={data} content={`${data} 내용`} />
            ))}
          </ul> */}
                  <h1>정식 버전에서는 작품 플래너의 내용을 이 메뉴에서 볼 수 있습니다.</h1>
                  <FillButton
                    type="button"
                    size="large"
                    variant="secondary"
                    iconType={<MdArrowOutward size={20} />}
                    iconPosition="trailing"
                    style={{
                      width: '100%',
                      color: 'white',
                      backgroundColor: '#666666',
                      justifyContent: 'space-between',
                    }}
                    onClick={handleRedirectPlanner}
                  >
                    작품 플래너 바로가기
                  </FillButton>
                </Pannel>
              </motion.div>
            </AnimatePresence>
          </Rnd>
        </div>
      ) : (
        <button onClick={onOpen} className={cx('container')}>
          작품 플래너
        </button>
      )}
    </>
  )
}
