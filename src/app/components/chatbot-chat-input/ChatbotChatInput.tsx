'use client'

import { KeyboardEvent, useState } from 'react'

import { useAtom, useAtomValue } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { FaRegStar } from 'react-icons/fa'
import { FaCircleArrowUp } from 'react-icons/fa6'
import { MdLanguage, MdOutlineLightbulb } from 'react-icons/md'
import { chatInputModeAtom } from 'store/chatInputModeAtom'
import { clickedButtonAtom } from 'store/clickedButtonAtom'
import { selectedPromptAtom } from 'store/selectedPromptAtom'
import { selectedRangeAtom } from 'store/selectedRangeAtom'

import AutoResizingTextArea from '@components/auto-resizing-textarea/AutoResizingTextarea'
import FillButton from '@components/buttons/FillButton'
import OutLinedButton from '@components/buttons/OutLinedButton'
import SelectMenu from '@components/select-menu/SelectMenu'

import classNames from 'classnames/bind'

import styles from './ChatbotChatInput.module.scss'

const FAVORITE_PROMPTS = [
  '즐겨찾는 프롬프트1',
  '즐겨찾는 프롬프트2',
  '즐겨찾는 프롬프트3',
  '즐겨찾는 프롬프트4',
]

const RECOMMEND_PROMPTS = [
  '추천 프롬프트1',
  '추천 프롬프트2',
  '추천 프롬프트3',
  '추천 프롬프트4',
  '추천 프롬프트 5',
]

const cx = classNames.bind(styles)

export default function ChatbotChatInput() {
  const [isFavoriteMenuOpen, setIsFavoriteMenuOpen] = useState(false)
  const [isRecommendMenuOpen, setIsRecommendMenuOpen] = useState(false)

  const content = useAtomValue(selectedRangeAtom)
  const [prompt, setPrompt] = useAtom(selectedPromptAtom)
  const [clickedButton, setClickedButton] = useAtom(clickedButtonAtom)

  const method = useForm({
    defaultValues: {
      content,
      prompt,
    },
  })

  const mode = useAtomValue(chatInputModeAtom)

  const { handleSubmit } = method

  const handleFormSubmit = (data: { content: string | undefined; prompt: string | null }) => {
    // 검색 모드 분기 처리
    if (clickedButton === 'search') {
      console.log(data)
    }
  }

  const handleChatInputKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(handleFormSubmit)()
    }
  }

  const handleClickButton = (type: 'search' | 'favorite' | 'recommend') => {
    if (clickedButton === 'search' && type === 'search') {
      setClickedButton(null)
    } else {
      setClickedButton(type)
    }

    switch (type) {
      case 'favorite':
        setIsFavoriteMenuOpen(true)
        break
      case 'recommend':
        setIsRecommendMenuOpen(true)
        break
    }
  }

  return (
    <FormProvider {...method}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className={cx('chatbox')}>
          {mode === 'input' && (
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
            </>
          )}
          <section className={cx('chatbox__buttons')}>
            {mode === 'input' && (
              <div className={cx('chatbox__buttons-left')}>
                <OutLinedButton
                  type="button"
                  name="search"
                  size="small"
                  shape="pill"
                  variant="secondary"
                  iconPosition="leading"
                  iconType={<MdLanguage color="#808080" size={16} />}
                  onClick={() => handleClickButton('search')}
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
                  {FAVORITE_PROMPTS.map((item, idx) => (
                    <>
                      <SelectMenu.Option
                        key={idx}
                        option={{
                          handleAction: () => {
                            setPrompt(item)
                            setIsFavoriteMenuOpen(false)
                          },
                        }}
                      >
                        {item}
                      </SelectMenu.Option>
                    </>
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
                  style={{ width: 'auto', left: 150, bottom: 35 }}
                >
                  {RECOMMEND_PROMPTS.map((item, idx) => (
                    <>
                      <SelectMenu.Option
                        key={idx}
                        option={{
                          handleAction: () => {
                            setPrompt(item)
                            setIsRecommendMenuOpen(false)
                          },
                        }}
                      >
                        {item}
                      </SelectMenu.Option>
                    </>
                  ))}
                </SelectMenu>
              </div>
            )}
            <div className={cx('chatbox__buttons-right')}>
              <FillButton
                size="xsmall"
                shape="pill"
                variant="secondary"
                iconPosition="only"
                iconType={<FaCircleArrowUp color="#1a1a1a" size={16} />}
              />
            </div>
          </section>
        </div>
      </form>
    </FormProvider>
  )
}
