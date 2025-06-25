import { ReactNode } from 'react'

import FillButton from '@components/buttons/FillButton'

import classNames from 'classnames/bind'

import styles from './FeedbackCard.module.scss'

interface FeedbackCardProps {
  image: ReactNode
  title?: string
  subTitle?: string
  content?: string
  buttonText?: string
  onClick?: () => void
}

const cx = classNames.bind(styles)

export default function FeedbackCard({
  image,
  title,
  subTitle,
  content,
  buttonText,
  onClick,
}: FeedbackCardProps) {
  return (
    <div className={cx('feedback-card__wrapper')}>
      <div className={cx('feedback-card__content')}>
        {(title || subTitle) && (
          <div className={cx('feedback-card__content-top')}>
            {title && <h1>{title}</h1>}
            {subTitle && <h3>{subTitle}</h3>}
          </div>
        )}
        <div className={cx('feedback-card__content-bottom')}>
          {image}
          {content && <h3>{content}</h3>}
        </div>
      </div>
      {buttonText && (
        <div className={cx('feedback-card__button-wrapper')}>
          <FillButton
            type="button"
            size="large"
            onClick={onClick}
            style={{
              width: '100%',
            }}
          >
            {buttonText}
          </FillButton>
        </div>
      )}
    </div>
  )
}
