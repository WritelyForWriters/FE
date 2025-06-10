'use client'

import { useRouter } from 'next/navigation'

import { ChangeEvent, KeyboardEvent, RefObject, useEffect, useRef, useState } from 'react'

import { Editor } from '@tiptap/react'
import { useAtom, useAtomValue } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { MdHome } from 'react-icons/md'
import { applyProductSettingsAtom } from 'store/applyProductSettings'
import { autoSaveMessageAtom, isEditableAtom } from 'store/editorAtoms'
import { productTitleAtom } from 'store/productsAtoms'
import { HandleEditor } from 'types/common/editor'
import { ModalHandler } from 'types/common/modalRef'

import ActionBar from '@components/action-bar/ActionBar'
import styles from '@components/action-bar/ActionBar.module.scss'
import TextButton from '@components/buttons/TextButton'
import Dropdown from '@components/dropdown/Dropdown'
import Modal from '@components/modal/Modal'
import PdfExportPreview from '@components/pdfExportPreview/PdfExportPreview'
import SelectMenu from '@components/select-menu/SelectMenu'
import EditModeSwitch from '@components/switch/EditModeSwitch'

import KeyboardShortcutsHelper from './KeyboardShortcutsHelper'

import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

type ExportMode = 'full' | 'toc'

interface WorkspaceActionBarProps {
  onClickSave: () => Promise<void>
  initialTitle?: string | null
  isInitialAccess: boolean
  editorRef: RefObject<HandleEditor | null>
  isSavedRef: RefObject<boolean>
}

export default function WorkspaceActionBar({
  onClickSave,
  initialTitle,
  isInitialAccess,
  editorRef,
  isSavedRef,
}: WorkspaceActionBarProps) {
  const router = useRouter()

  const methods = useForm()
  const ref = useRef<ModalHandler | null>(null)
  const modalRef = useRef<ModalHandler | null>(null)

  const pdfPreviewModalRef = useRef<ModalHandler | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const saveWarningModalRef = useRef<ModalHandler | null>(null)

  // 읽기/쓰기 모드를 구분하는 state
  const [isContentEditing, setIsContentEditing] = useAtom(isEditableAtom)

  const [applyProductSettings, setApplyProductSettings] = useAtom(applyProductSettingsAtom)

  // 저장 버튼 클릭 트리거 이벤트
  const handleSave = async () => {
    try {
      await onClickSave()
    } catch (error) {
      console.error(error)
    }
  }

  // 내보내기 버튼 클릭 트리거 이벤트
  const handleExport = () => {
    if (editorRef.current) {
      const editor = editorRef.current.getEditor() as Editor
      const html = editor.getHTML()

      if (previewRef.current) {
        previewRef.current.innerHTML = html
        pdfPreviewModalRef.current?.open()
      }
    }
  }

  const handleModalOpen = () => {
    ref.current?.open()
  }

  const handleModalClose = () => {
    ref.current?.close()
  }

  // 액션바 내 좌측 영역
  const ActionSectionContent = () => {
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

    const handleHomeButtonClick = () => {
      if (isSavedRef.current) {
        router.push('/')
      } else {
        modalRef.current?.open()
        history.pushState(null, '', '')
      }
    }

    return (
      <>
        <Modal
          ref={modalRef}
          title="나가기 전 작성한 내용을 저장해 주세요."
          cancelText="취소"
          confirmText="저장하기"
          onCancel={() => {
            modalRef.current?.close()
          }}
          onConfirm={async () => {
            await handleSave()
            isSavedRef.current = true
            modalRef.current?.close()
            history.pushState(null, '', '') // 뒤로가기 무효화 (다시 머무르게)
          }}
        />
        <button onClick={handleHomeButtonClick}>
          <MdHome size={24}></MdHome>
        </button>
        {isContentEditing ? (
          <>
            <TextButton size="large" onClick={handleSave}>
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
                {/* <SelectMenu.Option
                  option={{
                    handleAction: () => handleExportSelection('toc'),
                    className: styles['select-option'],
                  }}
                >
                  목차 내보내기
                </SelectMenu.Option> */}
              </SelectMenu>
            </div>
          </>
        ) : (
          <></>
        )}
      </>
    )
  }

  // 액션바 내 가운데 영역
  const TitleSectionContent = () => {
    // 타이틀 수정 모드를 구분하는 state
    const [isTitleEditing, setIsTitleEditing] = useState(false)

    // 타이틀명 state
    const [title, setTitle] = useState(initialTitle) // 로컬 상태 관리
    const [titleAtom, setTitleAtom] = useAtom(productTitleAtom) // 전역 상태 관리

    const autoSave = useAtomValue(autoSaveMessageAtom)

    // 엔터키 트리거 이벤트
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        setIsTitleEditing(false)
        setTitleAtom(title as string)
      }
    }

    useEffect(() => {
      setTitle(titleAtom)
    }, [titleAtom])

    return (
      <>
        {isTitleEditing && isContentEditing ? (
          <input
            className={cx('action-bar-input')}
            value={title as string}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            onBlur={() => {
              setIsTitleEditing(false)
              setTitleAtom(title as string)
            }}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span className={cx('action-bar-span')} onClick={() => setIsTitleEditing(true)}>
            {title}
          </span>
        )}
        {isContentEditing && !isTitleEditing && (
          <span className={cx('description')}>{autoSave.message}</span>
        )}
      </>
    )
  }

  // 액션바 내 우측 영역
  const ExtraSectionContent = () => {
    const handleSwitchReadMode = () => {
      if (isInitialAccess && !isSavedRef.current) {
        saveWarningModalRef.current?.open()
      } else {
        setIsContentEditing(false)
      }
    }

    return (
      <>
        <menu className={cx('action-bar-tabs')}>
          <EditModeSwitch
            isSelected={!applyProductSettings}
            onClick={() => setApplyProductSettings(false)}
          >
            AI에 설정 미반영
          </EditModeSwitch>
          <EditModeSwitch
            isSelected={applyProductSettings}
            onClick={() => setApplyProductSettings(true)}
          >
            AI에 설정 반영
          </EditModeSwitch>
        </menu>
        <menu className={cx('action-bar-tabs')}>
          <EditModeSwitch isSelected={!isContentEditing} onClick={handleSwitchReadMode}>
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
                // placeholder="파일 형태(단일 파일, 여러 파일)"
                placeholder="파일 형태(단일 파일)"
                label="파일 형태"
                options={[
                  {
                    label: '하나의 파일',
                    value: '하나의 파일',
                  },
                  // {
                  //   label: '여러 개의 파일',
                  //   value: '여러 개의 파일',
                  // },
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
                // placeholder="파일 포맷(pdf, docx, hwpx, epub) "
                placeholder="파일 포맷"
                label="파일 포맷"
                options={[
                  {
                    label: 'PDF 문서(.pdf)',
                    value: 'PDF 문서(.pdf)',
                  },
                  // {
                  //   label: 'Microsoft Word(.docx)',
                  //   value: 'Microsoft Word(.docx)',
                  // },
                  // {
                  //   label: '한글 파일(.hwpx)',
                  //   value: '한글 파일(.hwpx)',
                  // },
                  // {
                  //   label: 'EPUB 출판물(.epub)',
                  //   value: 'EPUB 출판물(.epub)',
                  // },
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

      <PdfExportPreview ref={pdfPreviewModalRef}>
        <div ref={previewRef}></div>
      </PdfExportPreview>

      <Modal
        ref={saveWarningModalRef}
        title="읽기 모드로 전환하기 전 작성한 내용을 저장해주세요."
        cancelText="취소"
        confirmText="저장하기"
        onCancel={() => {
          saveWarningModalRef.current?.close()
        }}
        onConfirm={async () => {
          await handleSave()
          isSavedRef.current = true
          saveWarningModalRef.current?.close()
          setIsContentEditing(false)
        }}
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
