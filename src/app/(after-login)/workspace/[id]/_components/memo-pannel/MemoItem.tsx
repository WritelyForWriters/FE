import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEY } from 'constants/common/queryKeys'
import { useAtomValue } from 'jotai'
import { FaCheck } from 'react-icons/fa6'
import { TfiMoreAlt } from 'react-icons/tfi'
import { productIdAtom } from 'store/productsAtoms'
import { MemosDto } from 'types/memos'

import { useUpdateMemosCompleted } from '@hooks/memos/useMemosMutation'

import { formatDate } from '@utils/formatDate'

import classNames from 'classnames/bind'

import styles from './MemoItem.module.scss'

const cx = classNames.bind(styles)

interface MemoItemProps {
  memoList: MemosDto
}

/**
 * TODO
 * [ ] 완료/해제에 따른 스타일
 * [ ] 커스텀 훅으로 리팩토링
 */
export default function MemoItem({ memoList }: MemoItemProps) {
  const { id: memoId, title, content, updatedAt, isCompleted } = memoList

  const queryClient = useQueryClient()
  const productId = useAtomValue(productIdAtom)
  const updateCompletedMutation = useUpdateMemosCompleted()

  const toggleCompleted = async (isCompleted: boolean) => {
    updateCompletedMutation.mutate(
      {
        productId,
        memoId,
        data: {
          isCompleted: !isCompleted,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.MEMO_LIST],
          })
        },
      },
    )
  }

  return (
    <li className={cx('memo-item')}>
      <div>
        <h3>{title ?? '타이틀'}</h3>
        <div className={cx('memo-item__button')}>
          <button onClick={() => toggleCompleted(isCompleted)}>
            <FaCheck color="#CCCCCC" />
          </button>
          <button>
            <TfiMoreAlt color="#CCCCCC" />
          </button>
        </div>
      </div>

      <p>{content}</p>
      <span>{formatDate(updatedAt)}</span>
    </li>
  )
}
