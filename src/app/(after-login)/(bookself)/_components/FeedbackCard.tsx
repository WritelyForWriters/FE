import Image from 'next/image'

import FillButton from '@components/buttons/FillButton'

import classNames from 'classnames/bind'

import styles from './FeedbackCard.module.scss'

interface FeedbackCardProps {
  imageSrc: string
  imageAlt: string
  imageWidth: number
  imageHeight: number
  title?: string
  subTitle?: string
  content?: string
  buttonText?: string
  onClick?: () => void
}

const cx = classNames.bind(styles)

export default function FeedbackCard({
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  title,
  subTitle,
  content,
  buttonText,
  onClick,
}: FeedbackCardProps) {
  return (
    <div className={cx('feedback-card__wrapper')}>
      <div className={cx('feedback-card__content')}>
        <div className={cx('feedback-card__content-top')}>
          {title && <h1>{title}</h1>}
          {subTitle && <h3>{subTitle}</h3>}
        </div>
        <div className={cx('feedback-card__content-bottom')}>
          <Image src={imageSrc} alt={imageAlt} width={imageWidth} height={imageHeight} />
          {content && <h3>{content}</h3>}
        </div>
      </div>
      {buttonText && (
        <div className={cx('feedback-card__button-wrapper')}>
          <FillButton type="button" size="large" onClick={onClick}>
            {buttonText}
          </FillButton>
        </div>
      )}
    </div>
  )
}
