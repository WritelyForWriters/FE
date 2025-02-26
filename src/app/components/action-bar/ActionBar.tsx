'use client'

import { useState } from 'react'

import { FiInfo } from 'react-icons/fi'
import { MdHome } from 'react-icons/md'

import FillButton from '@components/buttons/FillButton'
import SelectMenu from '@components/select-menu/SelectMenu'
import EditModeSwitch from '@components/switch/EditModeSwitch/EditModeSwitch'

import classNames from 'classnames/bind'

import styles from './ActionBar.module.scss'

const cx = classNames.bind(styles)

type usage = 'workspace' | 'planner'

interface ActionBarProps {
  usage: usage
}

export default function ActionBar({ usage }: ActionBarProps) {
  // 저장 여부 판단 state
  const [hasSaved, setHasSaved] = useState(false)

  // 읽기/쓰기 모드를 구분하는 state
  const [isContentEditing, setIsContentEditing] = useState(true)

  // 타이틀 수정 모드를 구분하는 state
  const [isTitleEditing, setIsTitleEditing] = useState(false)

  // 내보내기 버튼 클릭 여부 구분하는 state
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false)

  // 타이틀명 state
  const [title, setTitle] = useState('타이틀')

  // 홈 버튼 클릭 트리거 이벤트
  const handleHomeClick = () => {
    alert('내 서재로 이동합니다.')
  }

  // 저장 버튼 클릭 트리거 이벤트
  const handleSave = (usage: usage) => {
    setHasSaved(true)

    alert('저장 완료!')
    // 사용처에 따라 다르게 처리
    switch (usage) {
      case 'workspace':
        break
      case 'planner':
        break
    }
  }

  // 삭제 버튼 클릭 트리거 이벤트
  const handleDelete = (usage: usage) => {
    // 사용처에 따라 다르게 처리
    switch (usage) {
      case 'workspace':
        if (confirm('정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
          // 내용 삭제 및 페이지 이동
          alert('내 서재로 이동합니다.')
        }
        break
      case 'planner':
        break
    }
  }

  // 내보내기 버튼 클릭 트리거 이벤트
  const handleExport = () => {
    setIsExportMenuOpen(true)
  }

  // 엔터키 트리거 이벤트
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsTitleEditing(false)
    }
  }

  // 저장하기 버튼 렌더링 조건: (작업공간 & 쓰기모드) || (작품 플래너 && 저장 전)
  const showSaveButton =
    (usage === 'workspace' && isContentEditing) || (usage === 'planner' && !hasSaved)

  // 내보내기 버튼 렌더링 조건: (작업공간 & 쓰기모드)
  const showExportButton = usage === 'workspace' && isContentEditing

  // 삭제하기 버튼 렌더링 조건: (작업공간 & 읽기모드) || (작품 플래너 & 저장 후)
  const showDeleteButton =
    (usage === 'workspace' && !isContentEditing) || (usage === 'planner' && hasSaved)

  return (
    <div className={cx('.action-bar-wrapper')}>
      <div className={cx('action-bar-inner-container')}>
        <section className={cx('action-bar-action-section')}>
          {/* 홈 버튼 */}
          <button onClick={handleHomeClick}>
            <MdHome size={24}></MdHome>
          </button>
          {showSaveButton && <button onClick={() => handleSave(usage)}>저장하기</button>}
          {showExportButton && (
            <div className={cx('export-button')}>
              <button onClick={handleExport}>내보내기</button>
              {/* 내보내기 옵션 */}
              <SelectMenu handleClose={() => setIsExportMenuOpen(false)} isOpen={isExportMenuOpen}>
                <SelectMenu.Option option={{ className: styles['select-option'] }}>
                  작품 전체 내보내기
                </SelectMenu.Option>
                <SelectMenu.Option option={{ className: styles['select-option'] }}>
                  목차 내보내기
                </SelectMenu.Option>
              </SelectMenu>
            </div>
          )}
          {showDeleteButton && <button onClick={() => handleDelete(usage)}>삭제하기</button>}
        </section>
        <section className={cx('action-bar-info-section')}>
          <section className={cx('title')}>
            {isTitleEditing ? (
              <input
                className={cx('action-bar-input')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
          </section>
        </section>
        <section className={cx('action-bar-extra-action-section')}>
          {usage === 'workspace' ? (
            <>
              <button>
                <FiInfo size={20} color="#CCCCCC" />
              </button>
              <menu className={cx('action-bar-tabs')}>
                <EditModeSwitch
                  isSelected={!isContentEditing}
                  onClick={() => setIsContentEditing(false)}
                  disabled={!hasSaved}
                >
                  읽기 모드
                </EditModeSwitch>
                <EditModeSwitch
                  isSelected={isContentEditing}
                  onClick={() => setIsContentEditing(true)}
                >
                  쓰기 모드
                </EditModeSwitch>
              </menu>
            </>
          ) : (
            <FillButton size="large">집필하러 가기</FillButton>
          )}
        </section>
      </div>
    </div>
  )
}
