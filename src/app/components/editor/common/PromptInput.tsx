import { ChangeEvent, useEffect, useRef } from 'react'

import FillButton from '@components/buttons/FillButton'

import styles from './PromptInput.module.scss'

interface PromptInputProps {
  onPromptInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: () => void
  placeholder?: string
  buttonText?: string
  initialValue?: string
  hasButton?: boolean
}

/**
 * 수동 수정 prompt, 메모 입력 prompt, 구간 피드백 prompt(예정)에서 사용하는 textarea공통 컴포넌트
 */
export default function PromptInput({
  onPromptInputChange,
  onSubmit,
  placeholder,
  buttonText,
  hasButton = true,
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // textarea 높이 자동 조절 함수
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onPromptInputChange(e)
    adjustTextareaHeight()
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus({ preventScroll: true })
    }
    adjustTextareaHeight()
  }, [])

  return (
    <div className={styles['prompt-menu']}>
      <textarea
        readOnly={!hasButton}
        className={styles['prompt-menu__input']}
        ref={textareaRef}
        placeholder={placeholder}
        onChange={handleChange}
        rows={1}
        style={{ overflow: 'hidden' }}
      />
      {hasButton && (
        <FillButton
          type="button"
          size="medium"
          variant="primary"
          style={{
            padding: '0.8rem 1.2rem',
            height: '100%',
          }}
          onClick={onSubmit}
        >
          {buttonText}
        </FillButton>
      )}
    </div>
  )
}
