'use client'

import { useParams, useRouter } from 'next/navigation'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Editor } from '@tiptap/react'
import { AUTO_SAVE_MESSAGE } from 'constants/workspace/message'
import { DELAY_TIME } from 'constants/workspace/number'
import { useAtom, useSetAtom } from 'jotai'
import { chatbotFixedMessageAtom } from 'store/chatbotFixedMessageAtom'
import { chatbotHistoryAtom } from 'store/chatbotHistoryAtom'
import { autoSaveMessageAtom, editorContentAtom, isEditableAtom } from 'store/editorAtoms'
import { faviconRelativePositionAtom } from 'store/faviconRelativePositionAtom'
import { isChatbotOpenAtom } from 'store/isChatbotOpenAtom'
import { productIdAtom, productTitleAtom } from 'store/productsAtoms'
import { ChatItem } from 'types/chatbot/chatbot'
import { HandleEditor } from 'types/common/editor'
import { ModalHandler } from 'types/common/modalRef'
import { TocItemType } from 'types/common/pannel'

import ChatbotLauncher from '@components/chatbot-launcher/ChatbotLauncher'
import DefaultEditor from '@components/editor/DefaultEditor'
import Modal from '@components/modal/Modal'
import IndexPannel from '@components/pannel/IndexPannel'

import { useGetInfiniteAssistantHistory } from '@hooks/chatbot/useGetAssistantHistoryInfinite'
import { useGetFixedMessage } from '@hooks/chatbot/useGetFixedMessage'
import { useGetProductDetail, useProducts } from '@hooks/index'
import { useGetMemoList } from '@hooks/memos/useMemosQueries'

import { addHeadingIds, getTocFromEditor } from '@utils/index'

import MemoPannel from './_components/memo-pannel/MemoPannel'
import PlannerPannel from './_components/planner-pannel/PlannerPannel'
import WorkspaceActionBar from './_components/workspace-action-bar/WorkspaceActionBar'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

/**
 * TODO 작업공간 페이지 중 에디터 관련
 * [ ] 읽기 모드일때는 툴바 활성화 X
 * [ ] 단축키 '/'로 버블메뉴 활성화
 */

export default function WorkSpacePage() {
  const params = useParams<{ id: string }>()
  const editorRef = useRef<HandleEditor>(null)
  const modalRef = useRef<ModalHandler | null>(null)
  const isSavedRef = useRef(false)
  const router = useRouter()

  const { saveProductMutation } = useProducts()
  const { data: productDetail } = useGetProductDetail(params.id)
  const { data: memoList } = useGetMemoList(params.id) // MEMO(Sohyun): 메모 컴포넌트에서 요청하는것이 좋을까?

  const [productTitle, setProductTitle] = useAtom(productTitleAtom)
  const setIsContentEditing = useSetAtom(isEditableAtom)
  const editorContent = editorContentAtom(params.id)
  const setEditorContent = useSetAtom(editorContent)
  const setAutoSaveMessage = useSetAtom(autoSaveMessageAtom)
  const [productId, setProductId] = useAtom(productIdAtom)
  const setFixedMessage = useSetAtom(chatbotFixedMessageAtom)
  const setChatbotHistory = useSetAtom(chatbotHistoryAtom)
  const setFaviconRelativePosition = useSetAtom(faviconRelativePositionAtom)
  const setIsChatbotOpen = useSetAtom(isChatbotOpenAtom)

  const { data: previousChatbotHistory } = useGetInfiniteAssistantHistory(productId)
  const { data: fixedMessage } = useGetFixedMessage(productId)

  const [editorIndexToc, setEditorIndexToc] = useState<TocItemType[]>([])

  const handleSave = async () => {
    if (editorRef.current) {
      const editor = editorRef.current.getEditor() as Editor
      const contentsWithIds = addHeadingIds(editor.getJSON()) // heading에 id속성 부여된 최종 에디터 content

      saveProductMutation.mutate(
        {
          productId: params.id,
          product: {
            title: productTitle,
            content: JSON.stringify(contentsWithIds),
            isAutoSave: false,
          },
        },
        {
          onSuccess: () => localStorage.removeItem(`workspace-${params.id}`),
        },
      )
    }
    isSavedRef.current = true
  }

  // TODO hook으로 만들기
  // 렌더링 2번 실행시(react strict mode) 경로가 2번 추가되는 이슈 방지 flag 값
  const isClickedFirst = useRef(false)

  // 뒤로 가기 이벤트 핸들러
  const handlePopState = useCallback(() => {
    // --저장한 경우 뒤로가기 허용
    if (isSavedRef.current) {
      router.back()
    } else {
      // --그렇지 않은 경우, 모달 띄우고 현재 페이지를 다시 추가하여 뒤로가기 무효화
      modalRef.current?.open()
      history.pushState(null, '', '')
    }
  }, [router])

  // 새로고침 이벤트 핸들러
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (!isSavedRef.current) {
      e.preventDefault()
      e.returnValue = true // legacy 브라우저를 위해 추가
      return ''
    }
  }

  useEffect(() => {
    if (params.id) {
      setProductId(params.id)
    }
  }, [params.id, setProductId])

  useEffect(() => {
    // 최초 렌더링 시 현재 상태 저장 (뒤로 가기 무효화용)
    if (!isClickedFirst.current) {
      history.pushState(null, '', '')
      isClickedFirst.current = true
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [handlePopState])

  useEffect(() => {
    if (productDetail?.title) {
      // 작품 조회 API에서 받아온 리스폰스로 작품 제목 상태 초기화
      setProductTitle(productDetail.title)
    } else {
      setProductTitle('타이틀')
    }
    if (!productDetail?.title && !productDetail?.content) {
      setIsContentEditing(true)
    }
    // 에디터 저장한 값으로 toc 업데이트
    if (productDetail?.content) {
      const contentJSON = JSON.parse(productDetail.content)
      const toc = getTocFromEditor(contentJSON)
      setEditorIndexToc(toc)
    }
  }, [productDetail, setProductTitle, setIsContentEditing])

  useEffect(() => {
    if (!editorRef.current) return

    const interval = setInterval(() => {
      if (!editorRef.current) return

      const editor = editorRef.current.getEditor() as Editor
      const contentsWithIds = addHeadingIds(editor.getJSON())
      setEditorContent(JSON.stringify(contentsWithIds))

      // toc 업데이트
      const toc = getTocFromEditor(contentsWithIds)
      setEditorIndexToc(toc)

      // 자동 저장된 내용으로 에디터 업데이트
      editor.commands.setContent(contentsWithIds)

      setAutoSaveMessage({ message: AUTO_SAVE_MESSAGE.SAVING })

      setTimeout(() => {
        setAutoSaveMessage({ message: AUTO_SAVE_MESSAGE.WRITING })
      }, 3000)
    }, DELAY_TIME)

    return () => {
      clearInterval(interval)
    }
    // MEMO(Sohyun): dependency array에 setEditorContent를 넣게 되면 입력중에 interval 시작, 종료가 반복되므로 제외
  }, [])

  useEffect(() => {
    if (!previousChatbotHistory) return

    let allChats = previousChatbotHistory.pages[0].result.contents.toSorted(
      (a: ChatItem, b: ChatItem) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )

    for (let i = previousChatbotHistory.pages.length - 1; i >= 1; i--) {
      const pageContents = previousChatbotHistory.pages[i].result.contents

      if (pageContents.length > 0) {
        allChats = [...pageContents.slice(1), ...allChats]
      }
    }

    setChatbotHistory(allChats)
  }, [previousChatbotHistory, productId])

  useEffect(() => {
    setFixedMessage(
      fixedMessage?.result
        ? {
            messageId: fixedMessage.result.messageId,
            content: fixedMessage.result.content,
          }
        : null,
    )
  }, [fixedMessage, setFixedMessage, productId])

  useEffect(() => {
    setIsChatbotOpen(false)
    setFaviconRelativePosition({ xRatio: 0.9, yRatio: 0.7 })
  }, [productId])

  return (
    <div className={cx('container')}>
      <WorkspaceActionBar
        onClickSave={handleSave}
        initialTitle={productDetail ? productDetail?.title : ''}
        // 처음 작업공간에 진입했을때 읽기 모드, 그 이후에는 쓰기 모드로 진입
        isInitialAccess={!productDetail?.title && !productDetail?.content}
        editorRef={editorRef}
        isSavedRef={isSavedRef}
      />
      <div className={cx('header-space')}></div>

      <main className={cx('main-section')}>
        <IndexPannel toc={editorIndexToc} />

        <div className={cx('index-space')}></div>

        <div className={cx('main-section__contents')}>
          <DefaultEditor
            editorRef={editorRef}
            contents={productDetail?.content}
            isSavedRef={isSavedRef}
          />
        </div>

        <div>
          <div className={cx('main-section__pannel')}>
            <MemoPannel memoList={memoList} />
            <PlannerPannel />
          </div>
        </div>
        <div className={cx('main-section__chatbot')}>
          <ChatbotLauncher />
        </div>
      </main>

      <Modal
        ref={modalRef}
        title="나가기 전 작성한 내용을 저장해 주세요."
        cancelText="취소"
        confirmText="저장하기"
        onCancel={() => {
          modalRef.current?.close()
        }}
        onConfirm={async () => {
          await handleSave()
          isSavedRef.current = true
          modalRef.current?.close()
          history.pushState(null, '', '') // 뒤로가기 무효화 (다시 머무르게)
        }}
      />
    </div>
  )
}
