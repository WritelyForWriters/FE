'use client'

import Image from 'next/image'

import { ChangeEvent, Ref, RefObject, useEffect, useImperativeHandle, useRef } from 'react'

import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import Italic from '@tiptap/extension-italic'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import { postUserModify } from 'api/ai-assistant/aiAssistant'
import { useAtom, useAtomValue } from 'jotai'
import { FaCheck } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'
import { activeMenuAtom, aiResultAtom, isEditableAtom, originalPhraseAtom } from 'store/editorAtoms'
import { productIdAtom } from 'store/productsAtoms'
import { HandleEditor } from 'types/common/editor'

import FillButton from '@components/buttons/FillButton'
import SelectMenu from '@components/select-menu/SelectMenu'

import { useCollapsed } from '@hooks/common/useCollapsed'

import BlockquoteExtension from '@extensions/Blockquote'
import HeadingExtension from '@extensions/Heading'
import Indent from '@extensions/Indent'

import Toolbar from './Toolbar'

import styles from './DefaultEditor.module.scss'

interface DefaultEditorProps {
  editorRef: Ref<HandleEditor>
  isSavedRef: RefObject<boolean>
  contents?: string
}

interface TextSelectionRangeType {
  from: number
  to: number
}

export default function DefaultEditor({ editorRef, isSavedRef, contents }: DefaultEditorProps) {
  const [activeMenu, setActiveMenu] = useAtom(activeMenuAtom)
  const [originalText, setOriginalText] = useAtom(originalPhraseAtom)
  const [aiResult, setAiResult] = useAtom(aiResultAtom)

  const editable = useAtomValue(isEditableAtom)
  const productId = useAtomValue(productIdAtom)

  const selectionRef = useRef<TextSelectionRangeType | null>(null)
  const promptValueRef = useRef('')

  const { isOpen, onOpen, onClose } = useCollapsed()

  const editor = useEditor({
    editable,
    extensions: [
      Document,
      BlockquoteExtension,
      Text,
      Paragraph,
      Heading.configure({
        levels: [1],
      }),
      HeadingExtension,
      Indent,
      Bold,
      Italic,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'left',
      }),
      Highlight.configure({
        multicolor: true,
      }),
    ],
    immediatelyRender: false,
    content: contents ? JSON.parse(contents) : '내용을 입력해주세요.',
    onUpdate: () => {
      // 에디터에 변경사항이 생기면 저장 상태 false로 변경
      isSavedRef.current = false
    },
  })

  // 외부에서 에디터 인스턴스에 접근하기 위해 사용
  useImperativeHandle(editorRef, () => ({
    getEditor: () => editor,
  }))

  // --프롬프트 입력
  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    promptValueRef.current = e.target.value
  }

  // --드래그한 영역 저장 및 하이라이트
  const handleTextSelection = () => {
    if (!editor) return

    const { from, to } = editor.state.selection

    if (from !== to) {
      selectionRef.current = { from, to }

      // TODO 하이라이트
      editor?.commands.setMark('highlight', { color: '#FFFAE5' })
      return { from, to }
    }
    return null
  }

  const handleActiveMenu = () => {
    setActiveMenu('aiToolbar')

    // --선택한 원본 text 저장
    const selection = handleTextSelection()

    if (editor && selection) {
      const originPhrase = editor.getText().slice(selection?.from - 1, selection?.to)
      setOriginalText(originPhrase)
      console.log(originPhrase)
    }
  }

  // (방법 2)
  useEffect(() => {
    if (aiResult && selectionRef.current) {
      console.log(selectionRef.current)

      editor?.commands.insertContentAt(selectionRef.current, aiResult)
      selectionRef.current = {
        from: selectionRef.current.from,
        to: selectionRef.current.from + aiResult.length,
      }

      setAiResult('')
    }
  }, [aiResult])

  const handleAIPrompt = async () => {
    if (!promptValueRef || !selectionRef.current) return

    try {
      const response = await postUserModify({
        productId,
        content: originalText,
        prompt: promptValueRef.current,
      })

      if (response.id) {
        // TODO (방법 1) selection을 받아와서 대체 텍스트 삽입
        // editor.commands.insertContentAt(selection, response.answer)

        // TODO (방법 2) ai 응답을 받아서 전역 상태 저장 > DefaultEditor에서 삽입
        setAiResult(response.answer)
        onOpen()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleOptionClick = (option: 'apply' | 'recreate' | 'cancel') => () => {
    switch (option) {
      case 'apply':
        setActiveMenu('defaultToolbar')
        // editor?.chain().focus().unsetMark('highlight').run()
        onClose()
        break

      case 'recreate':
        handleAIPrompt()
        // editor?.chain().focus().unsetMark('highlight').run()
        onClose()
        break

      case 'cancel':
        if (selectionRef.current) {
          editor?.commands.insertContentAt(selectionRef.current, originalText)
        }
        editor?.commands.unsetMark('highlight')
        setActiveMenu('defaultToolbar')
        // editor?.chain().focus().unsetMark('highlight').run()
        onClose()
        break

      default:
        break
    }
  }

  useEffect(() => {
    if (!editor) {
      return undefined
    }
    editor.setEditable(editable)
  }, [editor, editable])

  // 에디터 초기 content 데이터 보여주기
  useEffect(() => {
    if (editor && contents && contents !== null) {
      editor.commands.setContent(JSON.parse(contents))
    }
  }, [editor, contents])

  if (!editor) {
    return null
  }

  return (
    <section className={styles.section}>
      <BubbleMenu
        editor={editor}
        tippyOptions={{
          duration: 100,
          maxWidth: 'none',
          onHidden: () => {
            // TODO remove text highlight 적용이 안되는 문제
            // editor.chain().focus().unsetMark('highlight').run()
          },
        }}
        // --shouldShow: 버블 메뉴 표시를 제어하는 콜백
        /* MEMO(Sohyun): DefaultEditor내부에서 editable 상태에따른 화면을 구현하고 싶었으나, 버블메뉴 shouldShow 상태 제어가 안되는 문제가 있음
          editable상태가 shouldShow에 즉각반영이 안됨, (참고) https://tiptap.dev/docs/guides/output-json-html#render */
        shouldShow={({ state }) => editable && !state.selection.empty}
      >
        {activeMenu === 'defaultToolbar' && (
          <Toolbar editor={editor} handleActiveMenu={handleActiveMenu} />
        )}
      </BubbleMenu>

      {activeMenu === 'aiToolbar' && (
        <div className={styles.container}>
          <div className={styles['prompt-menu']}>
            <input
              autoFocus
              className={styles['prompt-menu__input']}
              onChange={handleChangeInput}
            />

            <FillButton
              size="medium"
              variant="primary"
              style={{
                padding: '0.8rem 1.2rem',
                height: '100%',
              }}
              onClick={() => handleAIPrompt()}
            >
              생성하기
            </FillButton>
          </div>

          {/* TODO 툴바 메뉴 전환 */}
          <div className={styles['select-menu']}>
            <SelectMenu handleClose={onClose} isOpen={isOpen}>
              <SelectMenu.Option option={{ handleAction: handleOptionClick('apply') }}>
                <FaCheck color="#CCCCCC" fontSize={20} style={{ padding: '2px' }} />
                이대로 수정하기
              </SelectMenu.Option>
              <SelectMenu.Option option={{ handleAction: handleOptionClick('recreate') }}>
                <Image src="/icons/refresh.svg" alt="다시 생성하기" width={20} height={20} />
                다시 생성하기
              </SelectMenu.Option>
              <SelectMenu.Option option={{ handleAction: handleOptionClick('cancel') }}>
                <IoClose color="#CCCCCC" fontSize={20} />
                취소하기
              </SelectMenu.Option>
            </SelectMenu>
          </div>
        </div>
      )}

      <EditorContent editor={editor} className={styles.tiptap} />
    </section>
  )
}
