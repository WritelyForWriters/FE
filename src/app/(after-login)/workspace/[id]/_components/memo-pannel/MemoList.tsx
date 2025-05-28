import { MemosDto } from 'types/memos/memosResponseType'

import { useTabContext } from '@components/tab/Tab'

import MemoItem from './MemoItem'

import classNames from 'classnames/bind'

import styles from './MemoPannel.module.scss'

const cx = classNames.bind(styles)

interface MemoListProps {
  memoList?: MemosDto[]
}

export default function MemoList({ memoList }: MemoListProps) {
  const { activeTab } = useTabContext()

  const filteredMemos =
    (activeTab === 'progress' ? memoList?.filter((memo) => !memo.isCompleted) : memoList) ?? []

  return (
    <ul className={cx('memo-list')}>
      {filteredMemos?.map((memo) => (
        <MemoItem key={memo.id} memoList={memo} activeTab={activeTab} />
      ))}
    </ul>
  )
}
