/**
 * 툴바 단축키 툴팁
 * @author 선우
 */
import { KEYBOARD_SHORTCUTS } from 'constants/workspace/keyboardShortcuts'
import { useAtomValue } from 'jotai'
import { FiInfo } from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'
import { Tooltip } from 'react-tooltip'
import { isEditableAtom } from 'store/editorAtoms'

import styles from '@components/action-bar/ActionBar.module.scss'

import { useCollapsed } from '@hooks/common/useCollapsed'

import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export default function KeyboardShortcutsHelper() {
  // 단축키 도움말 버튼 클릭 여부 구분하는 state
  const { isOpen, onOpen, onClose } = useCollapsed(false)

  const isEditable = useAtomValue(isEditableAtom)

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
            {KEYBOARD_SHORTCUTS.map((item, idx) => (
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
      {isEditable && (
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
        </>
      )}
    </>
  )
}
