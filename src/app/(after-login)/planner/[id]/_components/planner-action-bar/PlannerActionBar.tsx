'use client'

import { ChangeEvent, KeyboardEvent, useState } from 'react'

import ActionBar from '@components/action-bar/ActionBar'
import styles from '@components/action-bar/ActionBar.module.scss'
import FillButton from '@components/buttons/FillButton'
import TextButton from '@components/buttons/TextButton'

import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export default function PlannerActionBar() {
  // 액션바 내 좌측 영역
  const ActionSectionContent = () => {
    // 저장 여부 판단 state
    const [hasSaved, setHasSaved] = useState(false)

    // 저장 버튼 클릭 트리거 이벤트
    const handleSave = () => {
      setHasSaved(true)

      alert('저장 완료!')
    }

    // 수정 버튼 클릭 트리거 이벤트
    const handleModify = () => {
      alert('수정 모드!')
    }

    // 삭제 버튼 클릭 트리거 이벤트
    const handleDelete = () => {
      alert('삭제 완료!')
    }

    return (
      <>
        {!hasSaved ? (
          <TextButton size="large" onClick={() => handleSave()}>
            저장하기
          </TextButton>
        ) : (
          <>
            <TextButton size="large" onClick={() => handleModify()}>
              수정하기
            </TextButton>
            <TextButton size="large" onClick={() => handleDelete()}>
              삭제하기
            </TextButton>
          </>
        )}
      </>
    )
  }

  // 액션바 내 가운데 영역
  const TitleSectionContent = () => {
    // 타이틀 수정 모드를 구분하는 state
    const [isTitleEditing, setIsTitleEditing] = useState(false)

    // 타이틀명 state
    const [title, setTitle] = useState('타이틀')

    // 엔터키 트리거 이벤트
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
