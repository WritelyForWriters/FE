'use client'

import { useRef } from 'react'

import { HandleEditor } from 'types/common/editor'

import DefaultEditor from '@components/editor/DefaultEditor'
import IndexPannel from '@components/pannel/IndexPannel'

import MemoPannel from './_components/memo-pannel/MemoPannel'
import PlannerPannel from './_components/planner-pannel/PlannerPannel'
import WorkspaceActionBar from './_components/workspace-action-bar/WorkspaceActionBar'

import classNames from 'classnames/bind'

import styles from '../../layout.module.scss'

const cx = classNames.bind(styles)

// mock data example
const TABLE_OF_CONTENTS = [
  { id: 'heading1', title: '제목 1' },
  { id: 'heading2', title: '제목 2' },
  { id: 'heading3', title: '제목 3' },
  { id: 'heading4', title: '제목 4' },
]

export default function WorkSpacePage() {
  const editorRef = useRef<HandleEditor>(null)

  const handleSave = async () => {
    if (editorRef.current) {
      const editor = editorRef.current.getEditor()
      console.log(editor)
      // TODO 에디터 저장로직
    }
  }

  return (
    <>
      <WorkspaceActionBar onClickSave={handleSave} />
      <div className={cx('header-space')}></div>

      <main className={cx('main-section')}>
        {/* TODO ToC 데이터를 IndexPannel로 전달 */}
        <IndexPannel toc={TABLE_OF_CONTENTS} />

        <div className={cx('index-space')}></div>

        <div className={cx('main-section__contents')}>
          <DefaultEditor ref={editorRef} />
        </div>

        <div>
          <div className={cx('main-section__pannel')}>
            <MemoPannel />
            <PlannerPannel />
          </div>
        </div>
      </main>
    </>
  )
}
