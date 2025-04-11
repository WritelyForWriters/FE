'use client'

import { useSetAtom } from 'jotai'
import { selectedRangeAtom } from 'store/selectedRangeAtom'

import ChatbotChatInput from '@components/chatbot-chat-input/ChatbotChatInput'

/**
 * TODO
 * [ ] UI 점검
 * [ ] 인가 처리 -> 로그인 기능 완료 후
 * [ ] 로그인 여부에 따른 버튼 UI -> 로그인 기능 완료 후
 */

export default function Home() {
  const setSelectedRange = useSetAtom(selectedRangeAtom)

  return (
    <div
      style={{
        width: 356,
        height: 600,
        margin: '0 auto',
      }}
    >
      <p onMouseUp={() => setSelectedRange(window.getSelection()?.toString())}>
        동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산
        대한사람 대한으로 길이 보전하세동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라
        만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세동해물과 백두산이 마르고 닳도록
        하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이
        보전하세동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리
        화려강산 대한사람 대한으로 길이 보전하세동해물과 백두산이 마르고 닳도록 하느님이 보우하사
        우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세동해물과 백두산이 마르고
        닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이
        보전하세동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리
        화려강산 대한사람 대한으로 길이 보전하세동해물과 백두산이 마르고 닳도록 하느님이 보우하사
        우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세동해물과 백두산이 마르고
        닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이
        보전하세동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리
        화려강산 대한사람 대한으로 길이 보전하세동해물과 백두산이 마르고 닳도록 하느님이 보우하사
        우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이 보전하세동해물과 백두산이 마르고
        닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리 화려강산 대한사람 대한으로 길이
        보전하세
      </p>
      <ChatbotChatInput />
    </div>
  )
}
