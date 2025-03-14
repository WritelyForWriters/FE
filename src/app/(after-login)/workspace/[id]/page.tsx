'use client'

import { useRef } from 'react'

import { HandleEditor } from 'types/common/editor'

import DefaultEditor from '@components/editor/DefaultEditor'

import IndexPannel from './_components/index-pannel/IndexPannel'
import MemoPannel from './_components/memo-pannel/MemoPannel'
import PlannerPannel from './_components/planner-pannel/PlannerPannel'
import WorkspaceActionBar from './_components/workspace-action-bar/WorkspaceActionBar'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

/**
 * MEMO(Sohyun) 목차 패널, 메모 패널은 에디터와 밀접하게 연결되어 있으므로 하위 컴포넌트로 묶어서 분리할 필요성 고민
 */

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
    <div className={cx('container')}>
      <WorkspaceActionBar onClickSave={handleSave} />

      <main className={cx('main-section')}>
        <IndexPannel />

        <div className={cx('main-section__editor')}>
          <DefaultEditor ref={editorRef} />
        </div>

        <div className={cx('main-section__pannel')}>
          <MemoPannel />
          <PlannerPannel />
        </div>
      </main>
    </div>
  )
}
