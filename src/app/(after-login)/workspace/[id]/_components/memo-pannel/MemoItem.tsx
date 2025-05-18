import { FaCheck } from 'react-icons/fa6'
import { TfiMoreAlt } from 'react-icons/tfi'

import classNames from 'classnames/bind'

import styles from './MemoItem.module.scss'

const cx = classNames.bind(styles)

interface MemoItemProps {
  title: string
  content?: string
}

export default function MemoItem({ title, content }: MemoItemProps) {
  return (
    <li className={cx('memo-item')}>
      <h3>
        {title ?? '타이틀'}
        <div>
          <button>
            <FaCheck color="#CCCCCC" />
          </button>
          <button>
            <TfiMoreAlt color="#CCCCCC" />
          </button>
        </div>
      </h3>

      <p>{content}</p>
      {/* TODO 생성 또는 수정 날짜로 수정 */}
      <span>2024.01.11</span>
    </li>
  )
}
