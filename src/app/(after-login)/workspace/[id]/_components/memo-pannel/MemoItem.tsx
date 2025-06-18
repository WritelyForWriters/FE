import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { Editor } from '@tiptap/react'
import { QUERY_KEY } from 'constants/common/queryKeys'
import { useAtomValue } from 'jotai'
import { trackEvent } from 'lib/amplitude'
import { FaCheck } from 'react-icons/fa6'
import { TfiMoreAlt } from 'react-icons/tfi'
import { productIdAtom } from 'store/productsAtoms'
import { MemosDto } from 'types/memos/memosResponseType'

import SelectMenu from '@components/select-menu/SelectMenu'

import { useCollapsed } from '@hooks/common/useCollapsed'
import removeMemosHighlight from '@hooks/editor/removeMemosHighlight'
import {
  useDeleteMemosById,
  useUpdateMemos,
  useUpdateMemosCompleted,
} from '@hooks/memos/useMemosMutation'

import { formatDate } from '@utils/formatDate'

import classNames from 'classnames/bind'

import styles from './MemoItem.module.scss'

const cx = classNames.bind(styles)

interface MemoItemProps {
  memoList: MemosDto
  activeTab: string
  editor: Editor
}

/**
 * TODO
 * [ ] 커스텀 훅으로 리팩토링
 */
export default function MemoItem({ memoList, activeTab, editor }: MemoItemProps) {
  const { id: memoId, title, content, updatedAt, isCompleted } = memoList
  const { selectedText, startIndex, endIndex } = memoList

  const [memoContent, setMemoContent] = useState(content)
  const [isEdit, setIsEdit] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { isOpen, onOpen, onClose } = useCollapsed()
  const queryClient = useQueryClient()
  const productId = useAtomValue(productIdAtom)
  const updateCompletedMutation = useUpdateMemosCompleted()
  const deleteMemosByIdMutation = useDeleteMemosById()
  const updateMemosMutation = useUpdateMemos()

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
          trackEvent('panel_interaction', {
            panel_name: '메모',
            action_type: '메모 완료 처리',
          })
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
          trackEvent('panel_interaction', {
            panel_name: '메모',
            action_type: '메모 삭제',
          })
          removeMemosHighlight(editor, memoId)
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.MEMO_LIST],
          })
        },
      },
    )
  }

  const updateMemos = async () => {
    updateMemosMutation.mutate({
      productId,
      memoId,
      data: {
        title,
        content: memoContent,
        selectedText,
        startIndex,
        endIndex,
      },
    })
  }

  const handleInputEdit = () => {
    trackEvent('panel_interaction', {
      panel_name: '메모',
      action_type: '메모 수정',
    })
    setIsEdit(true)
    onClose()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      updateMemos()
      setIsEdit(false)
    }
  }

  // textarea 높이 자동 조절
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [memoContent, isEdit])

  return (
    <li className={cx('memo-item')}>
      <div>
        <h3>
          {!selectedText ? (
            <span className={cx('memo-deleted-badge')}>삭제된 구간입니다</span>
          ) : (
            title
          )}
        </h3>
        <div className={cx('memo-item__button')}>
          {(activeTab === 'progress' || (activeTab === 'all' && isCompleted)) && (
            <>
              <button onClick={() => toggleCompleted(isCompleted)}>
                <FaCheck color={activeTab === 'all' ? '#1a1a1a' : '#CCCCCC'} />
              </button>

              {activeTab === 'progress' && (
                <button onClick={onOpen}>
                  <TfiMoreAlt color="#CCCCCC" />
                </button>
              )}
            </>
          )}

          <SelectMenu
            handleClose={onClose}
            isOpen={isOpen}
            style={{ width: '88px', height: 76, top: 20, right: 0, left: 'auto', gap: 0 }}
          >
            <SelectMenu.Option option={{ handleAction: handleInputEdit }}>수정</SelectMenu.Option>
            <SelectMenu.Option option={{ handleAction: deleteMemos }}>삭제</SelectMenu.Option>
          </SelectMenu>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        readOnly={!isEdit}
        value={memoContent}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMemoContent(e.target.value)}
        onKeyDown={handleKeyDown}
        className={cx('memo-item__textarea', { editable: isEdit })}
      />
      <span>{formatDate(updatedAt)}</span>
    </li>
  )
}
