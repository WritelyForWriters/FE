'use client'

import Image from 'next/image'

import { KeyboardEvent, useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { CHAT_ERROR_MESSAGE } from 'constants/chatbot/message'
import { RECOMMEND_PROMPTS } from 'constants/chatbot/recommendPrompts'
import { QUERY_KEY } from 'constants/common/queryKeys'
import { useAtom, useAtomValue } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { FaRegStar } from 'react-icons/fa'
import { FaCircleArrowUp } from 'react-icons/fa6'
import { MdLanguage, MdOutlineLightbulb } from 'react-icons/md'
import { chatInputModeAtom } from 'store/chatInputModeAtom'
import { chatModeAtom } from 'store/chatModeAtom'
import { clickedButtonAtom } from 'store/clickedButtonAtom'
import { productIdAtom } from 'store/productsAtoms'
import { selectedPromptAtom } from 'store/selectedPromptAtom'
import { selectedRangeAtom } from 'store/selectedRangeAtom'
import { ChatbotFormData, RecommendPrompt } from 'types/chatbot/chatbot'

import AutoResizingTextArea from '@components/auto-resizing-textarea/AutoResizingTextarea'
import FillButton from '@components/buttons/FillButton'
import OutLinedButton from '@components/buttons/OutLinedButton'
import SelectMenu from '@components/select-menu/SelectMenu'
import { useToast } from '@components/toast/ToastProvider'

import { useGetFavoritePrompts } from '@hooks/chatbot/useGetFavoritePrompts'
import { useSubmitDefaultChatMessage } from '@hooks/chatbot/useSubmitDefaultChatMessage'
import { useSubmitWebSearchChatMessage } from '@hooks/chatbot/useSubmitWebSearchChatMessage'

import classNames from 'classnames/bind'

import styles from './ChatbotChatInput.module.scss'

const cx = classNames.bind(styles)

export default function ChatbotChatInput() {
  const queryClient = useQueryClient()

  const [isFavoriteMenuOpen, setIsFavoriteMenuOpen] = useState(false)
  const [isRecommendMenuOpen, setIsRecommendMenuOpen] = useState(false)

  const inputMode = useAtomValue(chatInputModeAtom) // 입력 모드 | 탐색 모드

  const [content, setContent] = useAtom(selectedRangeAtom)
  const [chatMode, setChatMode] = useAtom(chatModeAtom) // 일반 모드 | 웹 검색 모드
  const [prompt, setPrompt] = useAtom(selectedPromptAtom)
  const [clickedButton, setClickedButton] = useAtom(clickedButtonAtom)
  const productId = useAtomValue(productIdAtom)

  const showToast = useToast()

  const { data } = useGetFavoritePrompts(productId)

  const favoritePrompts = data?.result ?? []

  const method = useForm<ChatbotFormData>({
    defaultValues: {
      productId,
      content: content ?? '',
      prompt,
    },
  })

  const { register, setValue, handleSubmit, reset } = method

  const { mutate: submitDefaultChatMessage, isPending: isDefaultPending } =
    useSubmitDefaultChatMessage({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ASSISTANT_HISTORY, productId] })
      },
    })

  const { mutate: submitWebSearchChatMessage, isPending: isWebSearchPending } =
    useSubmitWebSearchChatMessage({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ASSISTANT_HISTORY, productId] })
      },
    })

  useEffect(() => {
    setValue('content', content ?? '')
  }, [content, setValue])

  const handleSubmitChatMessage = (data: ChatbotFormData) => {
    if (chatMode === 'web') {
      submitWebSearchChatMessage({ ...data, sessionId: productId })
    } else {
      submitDefaultChatMessage(data)
    }

    setContent('')
    reset({ productId, content: '', prompt: '' })
  }

  const handleChatInputKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(handleSubmitChatMessage)()
    }
  }

  const handleClickButton = (type: 'web' | 'favorite' | 'recommend') => {
    if (clickedButton === 'web' && type === 'web') {
      setChatMode('default')
      setClickedButton(null)
    } else {
      setClickedButton(type)
    }

    switch (type) {
      case 'web':
        setChatMode(type)
        break
      case 'favorite':
        setIsFavoriteMenuOpen(true)
        break
      case 'recommend':
        setIsRecommendMenuOpen(true)
        break
    }
  }

  const handleRecommendPromptSelect = (item: RecommendPrompt) => {
    if (item.requiresSection) {
      showToast('warning', CHAT_ERROR_MESSAGE.SELECTED_REQUIRED)
      // TODO: 선택 구간 없으면 토스트 노출
    } else {
      setPrompt(item.prompt)
      setIsRecommendMenuOpen(false)
    }
  }

  const handleNavigateMessage = (direction: 'up' | 'down') => {
    console.log(direction)
  }

  return (
    <FormProvider {...method}>
      <form onSubmit={handleSubmit(handleSubmitChatMessage)}>
        <div className={cx('chatbox')}>
          {inputMode === 'input' && (
            <>
              {content && (
                <section className={cx('chatbox__quote')}>
                  <blockquote>{content}</blockquote>
                </section>
              )}
              <AutoResizingTextArea
                name="prompt"
                placeholder="작품에 대해 무엇이든 물어보세요!"
                keyDownHandler={handleChatInputKeyDown}
                className={cx('chatbox__message')}
                prompt={prompt}
              />
              <input type="hidden" {...register('content')} />
            </>
          )}
          <section className={cx('chatbox__buttons')}>
            {inputMode === 'input' ? (
              <div className={cx('chatbox__buttons-left')}>
                <OutLinedButton
                  type="button"
                  name="web"
                  size="small"
                  shape="pill"
                  variant="secondary"
                  iconPosition="leading"
                  iconType={<MdLanguage color="#808080" size={16} />}
                  onClick={() => handleClickButton('web')}
                >
                  검색
                </OutLinedButton>
                <OutLinedButton
                  type="button"
                  name="favorite"
                  size="small"
                  shape="pill"
                  variant="secondary"
                  iconPosition="leading"
                  iconType={<FaRegStar color="#808080" size={16} />}
                  onClick={() => handleClickButton('favorite')}
                >
                  즐겨찾기
                </OutLinedButton>
                <SelectMenu
                  handleClose={() => setIsFavoriteMenuOpen(false)}
                  isOpen={isFavoriteMenuOpen}
                  style={{ width: 'auto', left: 70, bottom: 35 }}
                >
                  {favoritePrompts.map((item: { messageId: string; prompt: string }) => (
                    <SelectMenu.Option
                      key={item.messageId}
                      option={{
                        handleAction: () => {
                          setPrompt(item.prompt)
                          setIsFavoriteMenuOpen(false)
                        },
                      }}
                    >
                      {item.prompt}
                    </SelectMenu.Option>
                  ))}
                </SelectMenu>
                <OutLinedButton
                  type="button"
                  name="recommend"
                  size="small"
                  shape="pill"
                  variant="secondary"
                  iconPosition="leading"
                  iconType={<MdOutlineLightbulb color="#808080" size={16} />}
                  onClick={() => handleClickButton('recommend')}
                >
                  추천 프롬프트
                </OutLinedButton>
                <SelectMenu
                  handleClose={() => setIsRecommendMenuOpen(false)}
                  isOpen={isRecommendMenuOpen}
                  style={{ width: 'auto', left: 150, bottom: 35, position: 'fixed', zIndex: 1000 }}
                >
                  {RECOMMEND_PROMPTS.map((item: RecommendPrompt, idx) => (
                    <SelectMenu.Option
                      key={idx}
                      option={{
                        handleAction: () => handleRecommendPromptSelect(item),
                      }}
                    >
                      {item.prompt}
                    </SelectMenu.Option>
                  ))}
                </SelectMenu>
              </div>
            ) : (
              <div></div>
            )}
            <div className={cx('chatbox__buttons-right')}>
              {inputMode === 'input' ? (
                <FillButton
                  disabled={isDefaultPending || isWebSearchPending}
                  type="submit"
                  size="xsmall"
                  shape="pill"
                  variant="secondary"
                  iconPosition="only"
                  iconType={<FaCircleArrowUp color="#1a1a1a" size={16} />}
                />
              ) : (
                <>
                  <button type="button" onClick={() => handleNavigateMessage('up')}>
                    <Image src="/icons/expand-circle-up.svg" alt="위" width={24} height={24} />
                  </button>
                  <button type="button" onClick={() => handleNavigateMessage('down')}>
                    <Image src="/icons/expand-circle-down.svg" alt="아래" width={24} height={24} />
                  </button>
                </>
              )}
            </div>
          </section>
        </div>
      </form>
    </FormProvider>
  )
}
