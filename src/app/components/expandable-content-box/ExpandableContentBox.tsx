/**
 * 접었다 폈다 할 수 있는 콘텐츠 박스 컴포넌트
 * @author 선우
 */
import Image from 'next/image'

import { ReactNode } from 'react'

import { useCollapsed } from '@hooks/common/useCollapsed'

import classNames from 'classnames/bind'

import styles from './ExpandableContentBox.module.scss'

const cx = classNames.bind(styles)

interface ExpandableContentBoxProps {
  content: ReactNode
  leftIcon?: ReactNode
}

export default function ExpandableContentBox({ content, leftIcon }: ExpandableContentBoxProps) {
  const { isOpen, onToggle } = useCollapsed()

  return (
    <div className={cx('content-box')}>
      <div className={cx('content-box__body')}>
        <div className={cx('content-box__main')}>
          {leftIcon && <div className={cx('content-box__icon')}>{leftIcon}</div>}
          <div
            className={cx('content-box__content', { 'content-box__content--collapse': !isOpen })}
          >
            {content}
          </div>
        </div>
        <div className={cx('content-box__button')}>
          <Image
            src={isOpen ? '/icons/arrow-up.svg' : '/icons/arrow-down.svg'}
            alt={isOpen ? '콘텐츠 접기' : '콘텐츠 펼치기'}
            onClick={onToggle}
            width={20}
            height={20}
          />
        </div>
      </div>
    </div>
  )
}
