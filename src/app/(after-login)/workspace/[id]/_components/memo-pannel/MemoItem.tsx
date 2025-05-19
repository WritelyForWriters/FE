import { FaCheck } from 'react-icons/fa6'
import { TfiMoreAlt } from 'react-icons/tfi'

import { formatDate } from '@utils/formatDate'

import classNames from 'classnames/bind'

import styles from './MemoItem.module.scss'

const cx = classNames.bind(styles)

interface MemoItemProps {
  title: string
  content?: string
  updatedAt: string
}

export default function MemoItem({ title, content, updatedAt }: MemoItemProps) {
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
      <span>{formatDate(updatedAt)}</span>
    </li>
  )
}
