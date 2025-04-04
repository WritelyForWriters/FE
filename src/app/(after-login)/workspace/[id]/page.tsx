'use client'

import { useParams, useRouter } from 'next/navigation'

import { useCallback, useEffect, useRef } from 'react'

import { useAtom, useSetAtom } from 'jotai'
import { isEditableAtom } from 'store/editorAtoms'
import { productTitleAtom } from 'store/productsAtoms'
import { HandleEditor } from 'types/common/editor'
import { ModalHandler } from 'types/common/modalRef'

import DefaultEditor from '@components/editor/DefaultEditor'
import Modal from '@components/modal/Modal'
import IndexPannel from '@components/pannel/IndexPannel'

import { useProducts } from '@hooks/products/useProductsMutation'
import { useGetProductDetail } from '@hooks/products/useProductsQueries'

import MemoPannel from './_components/memo-pannel/MemoPannel'
import PlannerPannel from './_components/planner-pannel/PlannerPannel'
import WorkspaceActionBar from './_components/workspace-action-bar/WorkspaceActionBar'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

/**
 * TODO 작업공간 페이지 중 에디터 관련
 * [ ] 읽기 모드일때는 툴바 활성화 X
 * [ ] 에디터 TOC
 * [ ] 자동 저장 기능
 *
 * 뒤로가기 플로우
 * - 뒤로가기 시 저장되지 않았다면 모달 오픈
 * - 모달에서 “저장하기” > 저장 후 isSaved = true 로 바꿈 > 뒤로가기 정상 작동
 * - 모달에서 “취소” > isSaved = false 유지 > 다시 뒤로가면 모달 재등장
 * - 에디터애서 변경 발생 시 isSaved = false로 전환하기 > 위의 플로우 반복
 */

// mock data example
const TABLE_OF_CONTENTS = [
  { id: 'heading1', title: '제목 1' },
  { id: 'heading2', title: '제목 2' },
  { id: 'heading3', title: '제목 3' },
  { id: 'heading4', title: '제목 4' },
]

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

  const handleSave = async () => {
    if (editorRef.current) {
      const editor = editorRef.current.getEditor()

      saveProductMutation.mutate({
        productId: params.id,
        product: {
          title: productTitle,
          content: JSON.stringify(editor?.getJSON()),
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

  useEffect(() => {
    // 최초 렌더링 시 현재 상태 저장 (뒤로 가기 무효화용)
    if (!isClickedFirst.current) {
      history.pushState(null, '', '')
      isClickedFirst.current = true
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
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
        {/* TODO ToC 데이터를 IndexPannel로 전달 */}
        <IndexPannel toc={TABLE_OF_CONTENTS} />

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
          history.pushState(null, '', '') // 현재 페이지를 다시 추가하여 뒤로 가기 무효화
        }}
        onConfirm={async () => {
          await handleSave()
          isSavedRef.current = true // 저장 완료 플래그
          modalRef.current?.close()
          history.pushState(null, '', '') // 뒤로가기 무효화 (다시 머무르게)
        }}
      />
    </div>
  )
}
