import DefaultEditor from '@components/editor/DefaultEditor'

import MemoPannel from './components/memo-pannel/MemoPannel'
import PlannerPannel from './components/planner-pannel/PlannerPannel'
import WorkspaceActionBar from './components/workspace-action-bar/WorkspaceActionBar'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

/**
 * MEMO(Sohyun) 목차 패널, 메모 패널은 에디터와 밀접하게 연결되어 있으므로 하위 컴포넌트로 묶어서 분리할 필요성 고민
 */
export default function WorkSpacePage() {
  return (
    <div className={cx('container')}>
      <WorkspaceActionBar />

      <main className={cx('main-section')}>
        <MemoPannel />

        <div className={cx('main-section__editor')}>
          <DefaultEditor />
        </div>

        <div className={cx('main-section__pannel')}>
          <MemoPannel />
          <PlannerPannel />
        </div>
      </main>
    </div>
  )
}
