'use client'

import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react'

import { FormProvider, useForm } from 'react-hook-form'

import ActionBar from '@components/action-bar/ActionBar'
import styles from '@components/action-bar/ActionBar.module.scss'
import TextButton from '@components/buttons/TextButton'
import Dropdown from '@components/dropdown/Dropdown'
import Modal from '@components/modal/Modal'
import SelectMenu from '@components/select-menu/SelectMenu'
import EditModeSwitch from '@components/switch/EditModeSwitch'

import KeyboardShortcutsHelper from './KeyboardShortcutsHelper'

import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

type ExportMode = 'full' | 'toc'

interface ModalHandler {
  open: () => void
  close: () => void
}

interface WorkspaceActionBarProps {
  onClickSave: () => Promise<void>
}

export default function WorkspaceActionBar({ onClickSave }: WorkspaceActionBarProps) {
  const methods = useForm()
  const ref = useRef<ModalHandler | null>(null)

  // 저장 여부 판단 state
  const [hasSaved, setHasSaved] = useState(false)

  // 읽기/쓰기 모드를 구분하는 state
  const [isContentEditing, setIsContentEditing] = useState(true)

  // 저장 버튼 클릭 트리거 이벤트
  const handleSave = async () => {
    setHasSaved(true)

    try {
      await onClickSave()
      alert('저장 완료!')
    } catch (error) {
      console.error(error)
    }
  }

  // 내보내기 버튼 클릭 트리거 이벤트
  const handleExport = () => {
    // TODO:: API 연동
  }

  const handleModalOpen = () => {
    ref.current?.open()
  }

  const handleModalClose = () => {
    ref.current?.close()
  }

  // 액션바 내 좌측 영역
  const ActionSectionContent = () => {
    // 삭제 버튼 클릭 트리거 이벤트
    const handleDelete = () => {
      if (confirm('정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
        // 내용 삭제 및 페이지 이동
        alert('내 서재로 이동합니다.')
      }
    }

    // 내보내기 버튼 클릭 여부 구분하는 state
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false)

    // 내보내기 구분 state
    // full: 전체 내보내기, toc: 목차 내보내기
    const [exportMode, setExportMode] = useState<ExportMode>()

    // prevent lint error
    console.log(exportMode)

    const handleExportSelection = (mode: ExportMode) => {
      setExportMode(mode)
      setIsExportMenuOpen(false)
      handleModalOpen()
    }

    return (
      <>
        {isContentEditing ? (
          <>
            <TextButton size="large" onClick={() => handleSave()}>
              저장하기
            </TextButton>
            <div className={cx('export-button-wrapper')}>
              <TextButton size="large" onClick={() => setIsExportMenuOpen(true)}>
                내보내기
              </TextButton>
              {/* 내보내기 옵션 */}
              <SelectMenu handleClose={() => setIsExportMenuOpen(false)} isOpen={isExportMenuOpen}>
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
          </>
        ) : (
          <TextButton size="large" onClick={() => handleDelete()}>
            삭제하기
          </TextButton>
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
    return (
      <>
        <menu className={cx('action-bar-tabs')}>
          <EditModeSwitch
            isSelected={!isContentEditing}
            onClick={() => setIsContentEditing(false)}
            disabled={!hasSaved}
          >
            읽기 모드
          </EditModeSwitch>
          <EditModeSwitch isSelected={isContentEditing} onClick={() => setIsContentEditing(true)}>
            쓰기 모드
          </EditModeSwitch>
        </menu>
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
      <ActionBar
        actionSection={<ActionSectionContent />}
        titleSection={<TitleSectionContent />}
        extraSection={
          <>
            <KeyboardShortcutsHelper />
            <ExtraSectionContent />
          </>
        }
      />
    </>
  )
}
