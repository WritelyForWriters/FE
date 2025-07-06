import Image from 'next/image'

import { useEffect, useState } from 'react'
import { ReactNode } from 'react'

import FeedbackCard from '(after-login)/(bookself)/_components/FeedbackCard'

import BottomSheet from '@components/bottom-sheet/BottomSheet'

interface MobileBottomSheetProviderProps {
  children: ReactNode
}

export default function MobileBottomSheetProvider({ children }: MobileBottomSheetProviderProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const isMobile = navigator.userAgent.match(
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i,
    )

    if (isMobile) {
      setShow(true)
    }
  }, [])

  return (
    <>
      <BottomSheet isOpen={show} onClose={() => setShow(false)}>
        <FeedbackCard
          image={<Image src="/images/pc.png" alt="pc" width={243} height={162} />}
          title={'PC에서 접속해 주세요'}
          subTitle={'모바일에서는 일부 기능을 이용할 수 없으니, \n꼭 PC로 접속해주세요.'}
          buttonText={'이해했어요'}
          onClick={() => setShow(false)}
        />
      </BottomSheet>
      {children}
    </>
  )
}
