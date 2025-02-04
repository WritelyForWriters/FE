'use client'

import { useState } from 'react'

import IconButton from '@components/Buttons/IconButton/IconButton'
import TextButton from '@components/Buttons/TextButton/TextButton'
import { HomeIcon } from '@components/Icons'
import EditModeSwitch from '@components/Switch/EditModeSwitch/EditModeSwitch'

import classNames from 'classnames/bind'

import styles from './ActionBar.module.scss'

const cx = classNames.bind(styles)

export default function ActionBar() {
  // 저장 여부 판단 state
  const [hasSaved, setHasSaved] = useState(false)

  // 읽기/쓰기 모드를 구분하는 state
  // defalut: true(쓰기모드)
  const [isContentEditing, setIsContentEditing] = useState(true)

  // 타이틀 수정 모드를 구분하는 state
  // default: false
  const [isTitleEditing, setIsTitleEditing] = useState(false)

  const handleSave = () => {
    alert('저장 되었습니다.')
    setHasSaved(true)
  }

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      alert('삭제 완료')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsTitleEditing(false)
    }
  }

  // 타이틀명 state
  const [title, setTitle] = useState('타이틀')

  return (
    <div className={cx('action-bar-container')}>
      <section className={cx('action-bar-buttons')}>
        {/* 홈 버튼 */}
        <IconButton onClick={() => alert('홈으로 이동합니다.')}>
          <HomeIcon />
        </IconButton>
        {/*삭제하기 버튼: 읽기 모드에서 노출 */}
        {!isContentEditing && <TextButton onClick={handleDelete}>삭제하기</TextButton>}
        {/*저장하기 & 내보내기 버튼: 쓰기 모드에서 노출 */}
        {isContentEditing && (
          <>
            <TextButton onClick={handleSave}>저장하기</TextButton>
            <TextButton>내보내기</TextButton>
          </>
        )}
      </section>
      <section>
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
      </section>
      <section>
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
      </section>
    </div>
  )
}
