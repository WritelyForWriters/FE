import {
  ChangeEvent,
  TextareaHTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

import classNames from 'classnames/bind'

import styles from './TextField.module.scss'

const cx = classNames.bind(styles)

interface TextFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string
  handleTextareaChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

/* NOTE(hajae):
 * react-hook-form의 register에서 제공하는 ref를 textarea에 연결하기 위해 forwardRef가 필요함.
 * 부모 컴포넌트에서 받은 ref를 textarea의 ref와 연결하기 위해 useImperativeHandle을 사용.
 * useImperativeHandle을 사용하지 않으면 react-hook-form이 textarea의 value를 감지하지 못해 required error가 발생할 수 있음.
 */
const TextFieldTextarea = forwardRef<HTMLTextAreaElement, TextFieldProps>(
  ({ value, handleTextareaChange, ...props }, ref) => {
    const [isExpand, setIsExpand] = useState(false)
    const textarea = useRef<HTMLTextAreaElement | null>(null)

    useImperativeHandle(ref, () => textarea.current as HTMLTextAreaElement)

    // NOTE(hajae): textarea 개행될 때 스크롤 resize를 위해.
    const handleTextareaHeight = () => {
      if (textarea.current) {
        textarea.current.style.height = 'auto'
        textarea.current.style.height = textarea.current.scrollHeight + 'px'
      }
    }

    const handleExpandClick = () => {
      setIsExpand((prev) => !prev)
    }

    useEffect(() => {
      handleTextareaHeight()
    }, [isExpand])

    return (
      <div className={cx('text-field__fieldset__wrapper')}>
        <textarea
          {...props}
          ref={textarea}
          className={cx('text-field__fieldset__text-area', {
            'text-field__fieldset__text-area--expand': isExpand,
          })}
          value={value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            handleTextareaChange?.(e)
            handleTextareaHeight()
          }}
          rows={1}
        />
        {isExpand ? (
          <IoIosArrowUp
            size={20}
            className={cx('text-field__fieldset__text-area__icon')}
            onClick={handleExpandClick}
          />
        ) : (
          <IoIosArrowDown
            size={20}
            className={cx('text-field__fieldset__text-area__icon')}
            onClick={handleExpandClick}
          />
        )}
      </div>
    )
  },
)

TextFieldTextarea.displayName = 'TextFieldTextarea'
export default TextFieldTextarea
