import FillButton from '@components/buttons/FillButton'
import Portal from '@components/modal/Portal'
import WorkspaceSlider from '@components/slider/WorkspaceSlider'

import classNames from 'classnames/bind'

import styles from './WorkspaceSlider.module.scss'

const cx = classNames.bind(styles)

interface WorkspaceSliderModalProps {
  confirmText: string
  onConfirm: () => void
}

// MEMO(Sohyun): 작업공간 튜토리얼 모달 컴포넌트
// dialog+useRef는 tutorialShownAtom atom가 false여도 초기 페이지로드 시, ref.current가 null인 경우 모달이 안열리는 문제가 있어 제거
export default function WorkspaceSliderModal({
  confirmText,
  onConfirm,
}: WorkspaceSliderModalProps) {
  return (
    <Portal>
      <div className={cx('modal-overlay')}>
        <div className={cx('modal-card')}>
          <WorkspaceSlider />
          <section>
            <FillButton size="large" onClick={onConfirm} style={{ width: '100%', height: 40 }}>
              {confirmText}
            </FillButton>
          </section>
        </div>
      </div>
    </Portal>
  )
}
