'use client'

import { ChangeEvent, KeyboardEvent, useState } from 'react'

import ActionBar from '@components/action-bar/ActionBar'
import styles from '@components/action-bar/ActionBar.module.scss'
import FillButton from '@components/buttons/FillButton'
import TextButton from '@components/buttons/TextButton'
import { useToast } from '@components/toast/ToastProvider'

import { useProducts } from '@hooks/products/useProductsMutation'
import { useGetProductDetail } from '@hooks/products/useProductsQueries'

import { formatMillisecondToMinute } from '@utils/formatDate'

import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface PlannerActionBarProps {
  productId: string
  isValidFormValues: boolean
  isSaved: boolean
  autoSaveTimer: number
  onSubmit: () => void
}

export default function PlannerActionBar({
  productId,
  isValidFormValues,
  isSaved,
  autoSaveTimer,
  onSubmit,
}: PlannerActionBarProps) {
  const { data: productDetail } = useGetProductDetail(productId)
  const { saveProductMutation } = useProducts()
  const showToast = useToast()

  const ActionSectionContent = () => {
    const [hasSaved, setHasSaved] = useState(isSaved)
    const handleSave = () => {
      if (!isValidFormValues) {
        showToast('warning', '필수 항목(장르, 로그라인)을 먼저 작성해주세요')
        return
      }

      onSubmit()
      setHasSaved(true)
    }

    return (
      <>
        {!hasSaved ? (
          <TextButton size="large" onClick={() => handleSave()}>
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
        <span className={cx('description')}>
          {autoSaveTimer > 0
            ? `${formatMillisecondToMinute(autoSaveTimer)}분 뒤에 자동 저장됩니다.`
            : '저장 중입니다.'}
        </span>
      </>
    )
  }

  const ExtraSectionContent = () => {
    return <FillButton size="large">집필하러 가기</FillButton>
  }

  // NOTE(hajae): 기존에 JSX 컴포넌트를 넘기던 방식(<Component />)에서
  // 함수 실행 결과를 넘기는 방식(Component())으로 변경하여 Hook 오류 방지
  return (
    <ActionBar
      actionSection={ActionSectionContent()}
      titleSection={TitleSectionContent()}
      extraSection={ExtraSectionContent()}
    />
  )
}
