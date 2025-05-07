'use client'

import { ChangeEvent, KeyboardEvent, useState } from 'react'

import ActionBar from '@components/action-bar/ActionBar'
import styles from '@components/action-bar/ActionBar.module.scss'
import FillButton from '@components/buttons/FillButton'
import TextButton from '@components/buttons/TextButton'

import { useProducts } from '@hooks/products/useProductsMutation'
import { useGetProductDetail } from '@hooks/products/useProductsQueries'

import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface PlannerActionBarProps {
  productId: string
  isValidFormValues: boolean
  isSaved: boolean
  onSubmit: () => void
}

export default function PlannerActionBar({
  productId,
  isValidFormValues,
  isSaved,
  onSubmit,
}: PlannerActionBarProps) {
  const { data: productDetail } = useGetProductDetail(productId)
  const { saveProductMutation } = useProducts()

  const ActionSectionContent = () => {
    const [hasSaved, setHasSaved] = useState(isSaved)
    const handleSave = () => {
      if (!isValidFormValues) return
      onSubmit()
      setHasSaved(true)
    }

    return (
      <>
        {!hasSaved ? (
          <TextButton size="large" onClick={() => handleSave()} disabled={!isValidFormValues}>
            저장하기
          </TextButton>
        ) : (
          <>
            <TextButton size="large" onClick={() => handleSave()}>
              수정하기
            </TextButton>
          </>
        )}
      </>
    )
  }

  const TitleSectionContent = () => {
    const [isTitleEditing, setIsTitleEditing] = useState(false)
    const [title, setTitle] = useState(productDetail?.title || '타이틀')

    // TODO(hajae):
    // 1. productDetail fetch후 content를 가지고 있음.
    // 2. 다른 기기 or 다른 브라우저에서 작업 후 타이틀을 저장하면 현재 가지고 있는 content로 덮어씌울 수 있음
    // Title만 저장하는 API가 필요할 지 추후 논의 필요
    const updateTitle = () => {
      saveProductMutation.mutate({
        productId: productId,
        product: {
          content: productDetail?.content,
          title: title,
          isAutoSave: false,
        },
      })
      setIsTitleEditing(false)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        updateTitle()
      }
    }

    const handleBlur = () => {
      updateTitle()
    }

    return (
      <>
        {isTitleEditing ? (
          <input
            className={cx('action-bar-input')}
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span className={cx('action-bar-span')} onClick={() => setIsTitleEditing(true)}>
            {title}
          </span>
        )}
        {/* Note: description은 동적 렌더링 필요 */}
        <span className={cx('description')}>저장 중</span>
      </>
    )
  }

  // 액션바 내 우측 영역
  const ExtraSectionContent = () => {
    return <FillButton size="large">집필하러 가기</FillButton>
  }

  return (
    <ActionBar
      actionSection={<ActionSectionContent />}
      titleSection={<TitleSectionContent />}
      extraSection={<ExtraSectionContent />}
    />
  )
}
