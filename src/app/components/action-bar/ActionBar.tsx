'use client'

import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react'

import { SHORTCUTS } from 'constants/workspace'
import { FormProvider, useForm } from 'react-hook-form'
import { FiInfo } from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'
import { MdHome } from 'react-icons/md'
import { Tooltip } from 'react-tooltip'

import FillButton from '@components/buttons/FillButton'
import TextButton from '@components/buttons/TextButton'
import Dropdown from '@components/dropdown/Dropdown'
import Modal from '@components/modal/Modal'
import SelectMenu from '@components/select-menu/SelectMenu'
import EditModeSwitch from '@components/switch/EditModeSwitch'

import { useCollapsed } from '@hooks/common/useCollapsed'

import classNames from 'classnames/bind'

import styles from './ActionBar.module.scss'

const cx = classNames.bind(styles)

type Usage = 'workspace' | 'planner'
type ExportMode = 'full' | 'toc'

interface ActionBarProps {
  usage: Usage
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
  const [exportMode, setExportMode] = useState<ExportMode>()

  // prevent lint error
  console.log(exportMode)

  // 타이틀명 state
  const [title, setTitle] = useState('타이틀')

  // 단축키 도움말 버튼 클릭 여부 구분하는 state
  const { isOpen, onOpen, onClose } = useCollapsed(false)

  // 홈 버튼 클릭 트리거 이벤트
  const handleHomeClick = () => {
    alert('내 서재로 이동합니다.')
  }

  // 저장 버튼 클릭 트리거 이벤트
  const handleSave = () => {
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
  const handleDelete = () => {
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
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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

  const handleExportSelection = (mode: ExportMode) => {
    setExportMode(mode)
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

  // 도움말 컴포넌트
  const ShortcutHelp = () => {
    return (
      <>
        <section className={cx('tooltip__title-section')}>
          <span>툴바 단축키</span>
          <button onClick={onClose}>
            <IoClose size={20} color="#B3B3B3" />
          </button>
        </section>
        <section className={cx('tooltip__content-section')}>
          <ul>
            {SHORTCUTS.map((item, idx) => (
              <li key={idx}>
                <span>{item.title}</span>
                <span>{item.shortcut}</span>
              </li>
            ))}
          </ul>
        </section>
      </>
    )
  }

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
            <form className={cx('form')}>
              <Dropdown
                name="exportType"
                type="outlined"
                placeholder="파일 형태(단일 파일, 여러 파일)"
                label="파일 형태"
                options={[
                  {
                    label: '하나의 파일',
                    value: '하나의 파일',
                  },
                  {
                    label: '여러 개의 파일',
                    value: '여러 개의 파일',
                  },
                ]}
                rules={{
                  required: {
                    value: true,
                    message: '필수 입력 항목입니다.',
                  },
                }}
              />
              <Dropdown
                name="fileFormat"
                type="outlined"
                placeholder="파일 포맷(pdf, docx, hwpx, epub) "
                label="파일 포맷"
                options={[
                  {
                    label: 'PDF 문서(.pdf)',
                    value: 'PDF 문서(.pdf)',
                  },
                  {
                    label: 'Microsoft Word(.docx)',
                    value: 'Microsoft Word(.docx)',
                  },
                  {
                    label: '한글 파일(.hwpx)',
                    value: '한글 파일(.hwpx)',
                  },
                  {
                    label: 'EPUB 출판물(.epub)',
                    value: 'EPUB 출판물(.epub)',
                  },
                ]}
                rules={{
                  required: {
                    value: true,
                    message: '필수 입력 항목입니다.',
                  },
                }}
              />
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
              <TextButton size="large" onClick={() => handleSave()}>
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
              <TextButton size="large" onClick={() => handleDelete()}>
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
            </section>
          </section>
          <section className={cx('action-bar-extra-action-section')}>
            {usage === 'workspace' ? (
              <>
                <button
                  data-tooltip-id="shortcut-help-tooltip"
                  data-tooltip-place="bottom-end"
                  onClick={onOpen}
                >
                  <FiInfo size={20} color="#CCCCCC" />
                </button>
                <Tooltip
                  noArrow
                  openOnClick
                  clickable
                  isOpen={isOpen}
                  id="shortcut-help-tooltip"
                  className={cx('tooltip')}
                >
                  <ShortcutHelp />
                </Tooltip>
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
