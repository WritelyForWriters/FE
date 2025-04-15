import ChatbotChatItem from '@components/chatbot-chat-item/ChatbotChatItem'

const CHATS = [
  {
    id: '01961ab0-4562-71cb-a964-7fd4a3d88f67',
    type: 'auto modify',
    memberMessage: {
      content: '그리고 그 과정에서 과거 사랑과 마주하게 된다.',
      prompt: null,
      isFavoritedPrompt: false,
    },
    assistantMessage: {
      content: '그리고 그 과정에서 과거의 사랑과 마주하게 된다.',
      isApplied: false,
    },
    createdAt: '2025-04-09T22:14:41.893651',
  },
  {
    id: '01961994-33d1-755d-b786-de74c4077e28',
    type: 'user modify',
    memberMessage: {
      content: 'AI가 감정을 흉내 내는 세상',
      prompt: '문장 다듬어줘',
      isFavoritedPrompt: false,
    },
    assistantMessage: {
      content: 'AI가 감정을 모방하는 세상',
      isApplied: false,
    },
    createdAt: '2025-04-09T17:04:25.172873',
  },
  {
    id: '01961982-7cf1-78c5-9661-ab9e936884a8',
    type: 'feedback',
    memberMessage: {
      content: 'AI가 감정을 흉내 내는 세상. 하지만 한 CEO는 진짜 감정을 지닌 AI를 만들려 한다.',
      prompt: '문장 수정해줘',
      isFavoritedPrompt: false,
    },
    assistantMessage: {
      content:
        'AI가 감정을 흉내 내는 세상. 그 속에서 한 CEO는 진짜 감정을 지닌 AI를 만들려 한다.:했습니다.  단순히 마침표로 연결된 것보다 맥락상 더 매끄럽게 이어지도록 했습니다.  원문의 간결한 스타일을 유지하면서 문장 간의 관계를 명확히 드러냈습니다.',
      isApplied: false,
    },
    createdAt: '2025-04-09T16:45:04.245849',
  },
  {
    id: '01961988-99b7-7539-9b18-9e607c0ac387',
    type: 'chat',
    memberMessage: {
      content: '',
      prompt: '안녕',
      isFavoritedPrompt: true,
    },
    assistantMessage: {
      content:
        '안녕하세요! SF 로맨스 영화 시나리오 공모전 출품을 위한 AI 비서입니다. 설정 정보를 바탕으로 최대한 도움이 되는 답변을 드리겠습니다. 어떤 점이 궁금하신가요? 시나리오 작성에 필요한 정보, 아이디어 구체화, 캐릭터 설정 등 무엇이든 편하게 질문해주세요.  어떤 모습인가요? 기술신앙은 어떤 특징을 가지고 있나요? 미치나요? 사랑이라는 주제를 어떻게 풀어나갈 수 있을까요? 《허(Her)》나 《이터널 선샤인》과 차별화되는 요소는 무엇일까요?',
      isApplied: false,
    },
    createdAt: '2025-04-09T16:51:44.826282',
  },
] as const

export default function ChatbotChatItems() {
  return (
    <>
      {CHATS.map((item) => (
        <ChatbotChatItem key={item.id} {...item} />
      ))}
    </>
  )
}
