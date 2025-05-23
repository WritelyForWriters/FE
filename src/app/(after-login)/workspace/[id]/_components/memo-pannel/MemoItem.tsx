import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEY } from 'constants/common/queryKeys'
import { useAtomValue } from 'jotai'
import { FaCheck } from 'react-icons/fa6'
import { TfiMoreAlt } from 'react-icons/tfi'
import { productIdAtom } from 'store/productsAtoms'
import { MemosDto } from 'types/memos'

import SelectMenu from '@components/select-menu/SelectMenu'

import { useCollapsed } from '@hooks/common/useCollapsed'
import { useDeleteMemosById, useUpdateMemosCompleted } from '@hooks/memos/useMemosMutation'

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

  const { isOpen, onOpen, onClose } = useCollapsed()
  const queryClient = useQueryClient()
  const productId = useAtomValue(productIdAtom)
  const updateCompletedMutation = useUpdateMemosCompleted()
  const deleteMemosByIdMutation = useDeleteMemosById()

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

  const deleteMemos = async () => {
    deleteMemosByIdMutation.mutate(
      {
        productId,
        memoId,
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
          <button onClick={onOpen}>
            <TfiMoreAlt color="#CCCCCC" />
          </button>

          <SelectMenu
            handleClose={onClose}
            isOpen={isOpen}
            style={{ width: '88px', height: 76, top: 20, right: 0, left: 'auto', gap: 0 }}
          >
            <SelectMenu.Option option={{}}>수정</SelectMenu.Option>
            <SelectMenu.Option
              option={{
                handleAction: deleteMemos,
              }}
            >
              삭제
            </SelectMenu.Option>
          </SelectMenu>
        </div>
      </div>

      <p>{content}</p>
      <span>{formatDate(updatedAt)}</span>
    </li>
  )
}
