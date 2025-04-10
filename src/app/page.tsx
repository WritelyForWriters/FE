import Chatbot from '@components/chatbot/Chatbot'

/**
 * TODO
 * [ ] UI 점검
 * [ ] 인가 처리 -> 로그인 기능 완료 후
 * [ ] 로그인 여부에 따른 버튼 UI -> 로그인 기능 완료 후
 */

export default async function Home() {
  return (
    <div>
      <Chatbot />
    </div>
  )
}
