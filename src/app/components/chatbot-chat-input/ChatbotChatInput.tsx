'use client'

import Image from 'next/image'

import { KeyboardEvent, useEffect, useState } from 'react'

import { getAssistantHistoryById } from 'api/chatbot/chatbot'
import { CHAT_ERROR_MESSAGE } from 'constants/chatbot/message'
import { RECOMMEND_PROMPTS } from 'constants/chatbot/recommendPrompts'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { FaRegStar } from 'react-icons/fa'
import { FaCircleArrowUp } from 'react-icons/fa6'
import { MdLanguage, MdOutlineLightbulb } from 'react-icons/md'
import { applyProductSettingsAtom } from 'store/applyProductSettings'
import { chatInputModeAtom } from 'store/chatInputModeAtom'
import { chatbotHistoryAtom } from 'store/chatbotHistoryAtom'
import { chatbotSelectedIndexAtom } from 'store/chatbotSelectedIndexAtom'
import { isAssistantRespondingAtom } from 'store/isAssistantRespondingAtom'
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
  const [isWebSearchMode, setIsWebSearchMode] = useState(false)
  const [clickedButton, setClickedButton] = useState<'favorite' | 'recommend' | null>(null)

  const [content, setContent] = useAtom(selectedRangeAtom)
  const [prompt, setPrompt] = useAtom(selectedPromptAtom)

  const inputMode = useAtomValue(chatInputModeAtom) // 입력 모드 | 탐색 모드
  const chatbotHistory = useAtomValue(chatbotHistoryAtom)
  const productId = useAtomValue(productIdAtom)
  const shouldApplySetting = useAtomValue(applyProductSettingsAtom)

  const setSelectedIndex = useSetAtom(chatbotSelectedIndexAtom)
  const setIsAssistantResponding = useSetAtom(isAssistantRespondingAtom)
  const setChatbotHistory = useSetAtom(chatbotHistoryAtom)

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
      onSuccess: async (data) => {
        try {
          const newMessage = await getAssistantHistoryById(productId, data as string)
          setChatbotHistory((prev) => [...prev, newMessage.result.contents[0]])
        } catch (error) {
          console.log(error)
        }
      },
      onError: (error) => {
        console.log(error)
        setIsAssistantResponding(false)
        showToast('warning', TOAST_MESSAGE.NETWORK_ERROR)
      },
      onSettled: () => {},
    })

  const { mutate: submitWebSearchChatMessage, isPending: isWebSearchPending } =
    useSubmitWebSearchChatMessage({
      onSuccess: async (data) => {
        try {
          const newMessage = await getAssistantHistoryById(productId, data as string)
          setChatbotHistory((prev) => [...prev, newMessage.result.contents[0]])
        } catch (error) {
          console.log(error)
        }
      },
      onError: () => {
        setIsAssistantResponding(false)
        showToast('warning', TOAST_MESSAGE.NETWORK_ERROR)
      },
      onSettled: () => {},
    })

  useEffect(() => {
    setValue('content', content ?? '')
  }, [content, setValue])

  const handleSubmitChatMessage = (data: ChatbotFormData) => {
    if (isWebSearchMode) {
      submitWebSearchChatMessage({ ...data, sessionId: '1', shouldApplySetting })
    } else {
      submitDefaultChatMessage({ ...data, shouldApplySetting })
    }

    setContent('')
    reset({ productId, content: '', prompt: '' })
  }

  useEffect(() => {
    setIsAssistantResponding(isDefaultPending || isWebSearchPending)
  }, [isDefaultPending, isWebSearchPending])

  const handleChatInputKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(handleSubmitChatMessage)()
    }
  }

  const handleClickButton = (type: 'web' | 'favorite' | 'recommend') => {
    switch (type) {
      case 'web':
        setIsWebSearchMode((prev) => !prev)
        break
      case 'favorite':
        setClickedButton('favorite')
        break
      case 'recommend':
        setClickedButton('recommend')
        break
    }
  }

  const handleRecommendPromptSelect = (item: RecommendPrompt) => {
    if (item.requiresSection && !content) {
      showToast('warning', CHAT_ERROR_MESSAGE.SELECTED_REQUIRED)
    } else {
      setPrompt(item.prompt)
      setClickedButton(null)
    }
  }

  const handleNavigateMessage = (direction: 'up' | 'down') => {
    switch (direction) {
      case 'up':
        setSelectedIndex((prev) => Math.max(0, --prev))
        break
      case 'down':
        setSelectedIndex((prev) => Math.min(chatbotHistory.length - 1, ++prev))
    }
  }

  // const scrollToBottom = () => {
  //   const chatWindow = document.getElementById('chatbot-window__body') as HTMLDivElement
  //   chatWindow.scrollTop = chatWindow.scrollHeight
  // }

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
                  style={{
                    backgroundColor: isWebSearchMode ? '#cccccc' : '',
                  }}
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
                  style={{
                    backgroundColor: clickedButton === 'favorite' ? '#cccccc' : '',
                  }}
                >
                  즐겨찾기
                </OutLinedButton>
                <SelectMenu
                  handleClose={() => setClickedButton(null)}
                  isOpen={clickedButton === 'favorite'}
                  style={{ width: 'auto', left: 70, bottom: 35 }}
                >
                  {favoritePrompts.map((item: { messageId: string; prompt: string }) => (
                    <SelectMenu.Option
                      key={item.messageId}
                      option={{
                        handleAction: () => {
                          setPrompt(item.prompt)
                          setClickedButton(null)
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
                  style={{
                    backgroundColor: clickedButton === 'recommend' ? '#cccccc' : '',
                  }}
                >
                  추천 프롬프트
                </OutLinedButton>
                <SelectMenu
                  handleClose={() => setClickedButton(null)}
                  isOpen={clickedButton === 'recommend'}
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
