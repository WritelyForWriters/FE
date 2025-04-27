'use client'

import { Ref, RefObject, useEffect, useImperativeHandle } from 'react'

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
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { activeMenuAtom, editorContentAtom, isEditableAtom, selectionAtom } from 'store/editorAtoms'
import { HandleEditor } from 'types/common/editor'

import { addHeadingIds } from '@utils/addHeadingId'

import BlockquoteExtension from '@extensions/Blockquote'
import HeadingExtension from '@extensions/Heading'
import Indent from '@extensions/Indent'

import PromptMenu from './PromptMenu'
import Toolbar from './Toolbar'

import styles from './DefaultEditor.module.scss'

// TODO 단축키 '/'로 버블메뉴 활성화

interface DefaultEditorProps {
  editorRef: Ref<HandleEditor>
  isSavedRef: RefObject<boolean>
  contents?: string
  productId: string
}

export default function DefaultEditor({
  editorRef,
  isSavedRef,
  contents,
  productId,
}: DefaultEditorProps) {
  const [activeMenu, setActiveMenu] = useAtom(activeMenuAtom)
  const setSelection = useSetAtom(selectionAtom)
  const editable = useAtomValue(isEditableAtom)

  const editorContent = editorContentAtom(productId)
  const setEditorContent = useSetAtom(editorContent)

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

  const handleActiveMenu = () => {
    setActiveMenu('aiToolbar')
  }

  /**
   * TODO
   * [x] 5분 마다 자동저장
   * [ ] toc 반영
   * [ ] 저장 후 로컬스토리지 제거
   */
  useEffect(() => {
    if (!editor) return

    const interval = setInterval(
      () => {
        const contentsWithIds = addHeadingIds(editor.getJSON())
        setEditorContent(JSON.stringify(contentsWithIds))
        console.log(`5분마다 저장 완료 ✅, ${JSON.stringify(contentsWithIds)}`) // 삭제하기
      },
      5 * 60 * 1000, // 상수화
    )
    return () => {
      clearInterval(interval)
    }
    // MEMO(Sohyun): dependency array에 setEditorContent를 넣게 되면 입력중에 interval 시작, 종료가 반복되므로 제외
  }, [editor])

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
            setActiveMenu('defaultToolbar')
            setSelection(null)

            // TODO remove text highlight 적용이 안되는 문제
            // editor.chain().focus().unsetMark('highlight').run()
          },
        }}
        // --shouldShow: 버블 메뉴 표시를 제어하는 콜백
        /* MEMO(Sohyun): DefaultEditor내부에서 editable 상태에따른 화면을 구현하고 싶었으나, 버블메뉴 shouldShow 상태 제어가 안되는 문제가 있음
          editable상태가 shouldShow에 즉각반영이 안됨, (참고) https://tiptap.dev/docs/guides/output-json-html#render */
        shouldShow={({ state }) => editable && !state.selection.empty}
      >
        {activeMenu === 'defaultToolbar' ? (
          <Toolbar editor={editor} handleActiveMenu={handleActiveMenu} />
        ) : (
          <PromptMenu editor={editor} />
        )}
      </BubbleMenu>
      <EditorContent editor={editor} className={styles.tiptap} />
    </section>
  )
}
