import FillButton from '@components/buttons/FillButton'

import classNames from 'classnames/bind'

import styles from './PromptInput.module.scss'

const cx = classNames.bind(styles)

export default function PropmptInput() {
  return (
    <div className={cx('prompt-menu')}>
      <input autoFocus className={cx('prompt-menu__input')} />
      <FillButton
        size="medium"
        variant="primary"
        style={{
          padding: '0.8rem 1.2rem',
          height: '100%',
        }}
      >
        생성하기
      </FillButton>
    </div>
  )
}
