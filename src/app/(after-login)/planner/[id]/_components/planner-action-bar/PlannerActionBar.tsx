'use client'

import { ChangeEvent, KeyboardEvent, useState } from 'react'

import ActionBar from '@components/action-bar/ActionBar'
import styles from '@components/action-bar/ActionBar.module.scss'
import FillButton from '@components/buttons/FillButton'
import TextButton from '@components/buttons/TextButton'

import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface PlannerActionBarProps {
  isValidFormValues: boolean
  isSaved: boolean
  onSubmit: () => void
}

export default function PlannerActionBar({
  isValidFormValues,
  isSaved,
  onSubmit,
}: PlannerActionBarProps) {
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
    const [title, setTitle] = useState('타이틀')

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        setIsTitleEditing(false)
      }
    }

    return (
      <>
        {isTitleEditing ? (
          <input
            className={cx('action-bar-input')}
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            onBlur={() => setIsTitleEditing(false)}
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
