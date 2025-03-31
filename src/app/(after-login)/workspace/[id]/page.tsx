'use client'

import { useParams } from 'next/navigation'

import { useEffect, useRef } from 'react'

import { useAtom, useSetAtom } from 'jotai'
import { isEditableAtom } from 'store/editorAtoms'
import { productTitleAtom } from 'store/productsAtoms'
import { HandleEditor } from 'types/common/editor'

import DefaultEditor from '@components/editor/DefaultEditor'
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
          isAutoSave: true,
        },
      })
    }
  }

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
          <DefaultEditor ref={editorRef} contents={productDetail?.content} />
        </div>

        <div>
          <div className={cx('main-section__pannel')}>
            <MemoPannel />
            <PlannerPannel />
          </div>
        </div>
      </main>
    </div>
  )
}
