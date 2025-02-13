import { useState } from 'react'

import { CheckIcon, MoreIcon } from '@components/Icons'
import IconButton from '@components/buttons/IconButton'
import Row from '@components/row/Row'
import Text from '@components/text/Text'

import classNames from 'classnames/bind'

import styles from './MemoCard.module.scss'

const cx = classNames.bind(styles)

function MemoCard() {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)

  return (
    <div className={cx('card')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className={cx('header')}>
        <Text fontSize="14px" fontWeight={700} color="#000">
          제목
        </Text>
        {isHovered && (
          <Row gap={4}>
            <IconButton>
              <CheckIcon />
            </IconButton>
            <IconButton>
              <MoreIcon />
            </IconButton>
          </Row>
        )}
      </div>
      <Text fontSize="14px" fontWeight={400} color="#000">
        메모 본문입니다.
      </Text>
      <Text fontSize="12px" fontWeight={400} color="#878787">
        2024.01.11
      </Text>
    </div>
  )
}

export default MemoCard
