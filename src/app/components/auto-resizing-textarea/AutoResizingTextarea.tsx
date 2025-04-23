'use client'

import { KeyboardEvent, TextareaHTMLAttributes, useCallback, useEffect, useRef } from 'react'

import { Controller, useFormContext } from 'react-hook-form'

interface AutoResizingTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string
  keyDownHandler: (e: KeyboardEvent<HTMLTextAreaElement>) => void
  prompt?: string
  resetHandler?: () => void
}

export default function AutoResizingTextArea({
  name,
  keyDownHandler,
  prompt,
  ...rest
}: AutoResizingTextAreaProps) {
  const { control, setValue } = useFormContext()

  useEffect(() => {
    if (prompt) {
      setValue(name, prompt)
    }
  }, [prompt, name, setValue])

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const autoResize = useCallback(() => {
    const textarea = textareaRef.current

    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [])

  useEffect(() => {
    autoResize()
  }, [autoResize])

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: true,
      }}
      render={({ field }) => (
        <textarea
          ref={textareaRef}
          rows={1}
          value={field.value}
          onInput={autoResize}
          onChange={(e) => field.onChange(e.target.value)}
          onKeyDown={keyDownHandler}
          {...rest}
        />
      )}
    />
  )
}
