'use client'

import Image from 'next/image'

import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'

import { getAssistantHistoryById } from 'api/chatbot/chatbot'
import { CHAT_ERROR_MESSAGE } from 'constants/chatbot/message'
import { RECOMMEND_PROMPTS } from 'constants/chatbot/recommendPrompts'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { FaRegStar } from 'react-icons/fa'
import { FaCircleArrowUp } from 'react-icons/fa6'
import { MdLanguage, MdOutlineLightbulb } from 'react-icons/md'
import { Tooltip } from 'react-tooltip'
import { applyProductSettingsAtom } from 'store/applyProductSettings'
import { chatInputModeAtom } from 'store/chatInputModeAtom'
import { chatLifecycleSessionId } from 'store/chatLifecycleSessionId'
import { chatbotHistoryAtom } from 'store/chatbotHistoryAtom'
import { chatbotIsDelayAtom } from 'store/chatbotIsDelayAtom'
import { chatbotPendingMessageAtom } from 'store/chatbotPendingMessageAtom'
import { chatbotSelectedIndexAtom } from 'store/chatbotSelectedIndexAtom'
import { isAssistantRespondingAtom } from 'store/isAssistantRespondingAtom'
import { prevContentAtom } from 'store/prevContentAtom'
import { productIdAtom } from 'store/productsAtoms'
import { sectionSessionIdAtom } from 'store/sectionSessionIdAtom'
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
  const [sectionSessionId, setSectionSessionId] = useAtom(sectionSessionIdAtom)
  const [prevContent, setPrevContent] = useAtom(prevContentAtom)

  const inputMode = useAtomValue(chatInputModeAtom) // 입력 모드 | 탐색 모드
  const chatbotHistory = useAtomValue(chatbotHistoryAtom)
  const productId = useAtomValue(productIdAtom)
  const shouldApplySetting = useAtomValue(applyProductSettingsAtom)
  const chatLifeCycleSessionId = useAtomValue(chatLifecycleSessionId)

  const setSelectedIndex = useSetAtom(chatbotSelectedIndexAtom)
  const setIsAssistantResponding = useSetAtom(isAssistantRespondingAtom)
  const setChatbotHistory = useSetAtom(chatbotHistoryAtom)
  const setIsDelay = useSetAtom(chatbotIsDelayAtom)
  const setChatbotPendingMessage = useSetAtom(chatbotPendingMessageAtom)

  const showToast = useToast()

  const { data } = useGetFavoritePrompts(productId)

  const favoritePrompts = data?.result ?? []
  const hasFavoritePrompt = favoritePrompts.length > 0

  const timerIdRef = useRef<NodeJS.Timeout>(undefined)

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
      onMutate: ({ prompt, content }) => {
        setChatbotPendingMessage({ prompt, content })
        timerIdRef.current = setTimeout(() => {
          setIsDelay(true)
        }, 10000)
      },
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
      onSettled: () => {
        setChatbotPendingMessage(null)
        if (timerIdRef.current) {
          clearTimeout(timerIdRef.current)
          timerIdRef.current = undefined
        }
        setIsDelay(false)
      },
    })

  const { mutate: submitWebSearchChatMessage, isPending: isWebSearchPending } =
    useSubmitWebSearchChatMessage({
      onMutate: ({ prompt, content }) => {
        setChatbotPendingMessage({ prompt, content })
        timerIdRef.current = setTimeout(() => {
          setIsDelay(true)
        }, 10000)
      },
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
      onSettled: () => {
        setChatbotPendingMessage(null)
        if (timerIdRef.current) {
          clearTimeout(timerIdRef.current)
          timerIdRef.current = undefined
        }
        setIsDelay(false)
      },
    })

  useEffect(() => {
    setValue('content', content ?? '')
  }, [content, setValue])

  const handleSubmitChatMessage = (data: ChatbotFormData) => {
    const { content: currentContent } = data

    let sessionId: string

    if (currentContent) {
      if (prevContent === currentContent) {
        sessionId = sectionSessionId
      } else {
        const newSectionSessionId = new Date().getTime().toString()
        sessionId = newSectionSessionId
        setPrevContent(currentContent)
        setSectionSessionId(newSectionSessionId)
      }
    } else {
      sessionId = chatLifeCycleSessionId as string
    }

    if (isWebSearchMode) {
      submitWebSearchChatMessage({ ...data, sessionId, shouldApplySetting })
    } else {
      submitDefaultChatMessage({ ...data, sessionId, shouldApplySetting })
    }

    setContent('')
    reset({ productId, content: '', prompt: '' })
  }

  useEffect(() => {
    setIsAssistantResponding(isDefaultPending || isWebSearchPending)
  }, [isDefaultPending, isWebSearchPending])

  const onSubmit = useCallback(handleSubmit(handleSubmitChatMessage), [
    handleSubmit,
    handleSubmitChatMessage,
  ])

  const handleChatInputKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit() // 안정적인 콜백 호출
    }
  }

  const handleClickButton = (type: 'web' | 'favorite' | 'recommend') => {
    switch (type) {
      case 'web':
        setIsWebSearchMode((prev) => !prev)
        break
      case 'favorite':
        if (!hasFavoritePrompt) return
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
                  data-tooltip-id="favorite-prompt-tooltip"
                >
                  즐겨찾기
                </OutLinedButton>
                {hasFavoritePrompt ? (
                  <SelectMenu
                    handleClose={() => setClickedButton(null)}
                    isOpen={clickedButton === 'favorite'}
                    style={{
                      height: 'auto',
                      left: 90,
                      bottom: 35,
                      position: 'fixed',
                      zIndex: 1000,
                      minWidth: 300,
                      maxHeight: 292,
                      overflowY: 'auto',
                    }}
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
                ) : (
                  <Tooltip
                    id="favorite-prompt-tooltip"
                    className={cx('tooltip')}
                    positionStrategy="fixed"
                  >
                    아직 즐겨찾기한 메시지가 없습니다.
                    <br />
                    보낸 메시지 아래 ☆ 버튼으로 메시지를 즐겨찾기 해보세요.
                  </Tooltip>
                )}
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
                  style={{
                    height: 292,
                    left: 170,
                    bottom: 35,
                    position: 'fixed',
                    zIndex: 1000,
                    minWidth: 300,
                  }}
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
