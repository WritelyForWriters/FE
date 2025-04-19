'use client'

import { useParams, useRouter } from 'next/navigation'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Editor } from '@tiptap/react'
import { useAtom, useSetAtom } from 'jotai'
import { isEditableAtom } from 'store/editorAtoms'
import { productTitleAtom } from 'store/productsAtoms'
import { HandleEditor } from 'types/common/editor'
import { ModalHandler } from 'types/common/modalRef'
import { TocItemType } from 'types/common/pannel'

import DefaultEditor from '@components/editor/DefaultEditor'
import Modal from '@components/modal/Modal'
import IndexPannel from '@components/pannel/IndexPannel'

import { useGetProductDetail, useProducts } from '@hooks/index'

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
 * [x] 에디터 TOC
 * [ ] 자동 저장 기능 + TOC 업데이트
 */

export default function WorkSpacePage() {
  const params = useParams<{ id: string }>()
  const editorRef = useRef<HandleEditor>(null)
  const modalRef = useRef<ModalHandler | null>(null)
  const isSavedRef = useRef(false)
  const router = useRouter()

  const { saveProductMutation } = useProducts()
  const { data: productDetail } = useGetProductDetail(params.id)

  const [productTitle, setProductTitle] = useAtom(productTitleAtom)
  const setIsContentEditing = useSetAtom(isEditableAtom)

  const [editorIndexToc, setEditorIndexToc] = useState<TocItemType[]>([])

  const handleSave = async () => {
    if (editorRef.current) {
      const editor = editorRef.current.getEditor() as Editor
      const contentsWithIds = addHeadingIds(editor.getJSON()) // heading에 id속성 부여된 최종 에디터 content

      saveProductMutation.mutate({
        productId: params.id,
        product: {
          title: productTitle,
          content: JSON.stringify(contentsWithIds),
          isAutoSave: false,
        },
      })
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

  return (
    <div className={cx('container')}>
      <WorkspaceActionBar
        onClickSave={handleSave}
        initialTitle={productDetail ? productDetail?.title : ''}
        // 처음 작업공간에 진입했을때 읽기 모드, 그 이후에는 쓰기 모드로 진입
        isInitialAccess={!productDetail?.title && !productDetail?.content}
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
            <MemoPannel />
            <PlannerPannel />
          </div>
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
