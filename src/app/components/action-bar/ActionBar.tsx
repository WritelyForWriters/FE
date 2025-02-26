'use client'

import { useRef, useState } from 'react'

import { FormProvider, useForm } from 'react-hook-form'
import { FiInfo } from 'react-icons/fi'
import { MdHome } from 'react-icons/md'

import FillButton from '@components/buttons/FillButton'
import TextButton from '@components/buttons/TextButton'
import Modal from '@components/modal/Modal'
import SelectMenu from '@components/select-menu/SelectMenu'
import EditModeSwitch from '@components/switch/EditModeSwitch'

import classNames from 'classnames/bind'

import styles from './ActionBar.module.scss'

const cx = classNames.bind(styles)

type usage = 'workspace' | 'planner'
type exportMode = 'full' | 'toc'

interface ActionBarProps {
  usage: usage
}

interface ModalHandler {
  open: () => void
  close: () => void
}

export default function ActionBar({ usage }: ActionBarProps) {
  const methods = useForm()
  const ref = useRef<ModalHandler | null>(null)

  // 저장 여부 판단 state
  const [hasSaved, setHasSaved] = useState(false)

  // 읽기/쓰기 모드를 구분하는 state
  const [isContentEditing, setIsContentEditing] = useState(true)

  // 타이틀 수정 모드를 구분하는 state
  const [isTitleEditing, setIsTitleEditing] = useState(false)

  // 내보내기 버튼 클릭 여부 구분하는 state
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false)

  // 내보내기 구분 state
  // full: 전체 내보내기, toc: 목차 내보내기
  const [exportMode, setExportMode] = useState<exportMode>()

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

  const handleModalClose = () => {
    ref.current?.close()
  }

  const handleModalOpen = () => {
    ref.current?.open()
  }

  const handleExportSelection = (exportMode: exportMode) => {
    setExportMode(exportMode)
    setIsExportMenuOpen(false)
    handleModalOpen()
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
    <>
      <Modal
        ref={ref}
        title="작품 전체 내보내기"
        cancelText="취소"
        confirmText="내보내기"
        onCancel={handleModalClose}
        onConfirm={handleExport}
        subtitle="내보낼 파일의 형태와 형식을 지정해 주세요."
        content={
          <FormProvider {...methods}>
            <form>
              {/* 드롭다운 컴포넌트 머지 되면 반영 */}
              <span>{exportMode === 'full' ? '작품 전체' : '목차'} 내보내기</span>
            </form>
          </FormProvider>
        }
      />
      <div className={cx('action-bar-wrapper')}>
        <div className={cx('action-bar-inner-container')}>
          <section className={cx('action-bar-action-section')}>
            {/* 홈 버튼 */}
            <button onClick={handleHomeClick}>
              <MdHome size={24}></MdHome>
            </button>
            {showSaveButton && (
              <TextButton size="large" onClick={() => handleSave(usage)}>
                저장하기
              </TextButton>
            )}
            {showExportButton && (
              <div className={cx('export-button-wrapper')}>
                <TextButton size="large" onClick={() => setIsExportMenuOpen(true)}>
                  내보내기
                </TextButton>
                {/* 내보내기 옵션 */}
                <SelectMenu
                  handleClose={() => setIsExportMenuOpen(false)}
                  isOpen={isExportMenuOpen}
                >
                  <SelectMenu.Option
                    option={{
                      handleAction: () => handleExportSelection('full'),
                      className: styles['select-option'],
                    }}
                  >
                    작품 전체 내보내기
                  </SelectMenu.Option>
                  <SelectMenu.Option
                    option={{
                      handleAction: () => handleExportSelection('toc'),
                      className: styles['select-option'],
                    }}
                  >
                    목차 내보내기
                  </SelectMenu.Option>
                </SelectMenu>
              </div>
            )}
            {showDeleteButton && (
              <TextButton size="large" onClick={() => handleDelete(usage)}>
                삭제하기
              </TextButton>
            )}
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
                {/* Note: 해당 버튼 클릭 시 도움말 메뉴 오픈 */}
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
    </>
  )
}
