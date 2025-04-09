import ChatbotChatItem from '@components/chatbot-chat-item/ChatbotChatItem'

const CHATS = [
  {
    id: '01961989-1b2e-79db-ad15-8a99d19f5afe',
    type: 'chat',
    memberMessage: {
      content: '하지만 한 CEO는 진짜 감정을 지닌 AI를 만들려 한다.',
      prompt: '이 문장 어때?',
    },
    assistantMessage: {
      content:
        '어떤 문장에 대한 평가를 원하시는지 명확하게 알려주시면 더 정확한 피드백을 드릴 수 있습니다.  같은 정보를 알려주세요.   **어떤 측면에서 평가를 원하시나요?** (예: 문장의 명확성, 흥미도, 문맥과의 적합성, 문법적 정확성 등)신 정보들을 바탕으로 문장을 분석하고, 개선점을 제안해 드리겠습니다.',
      isApplied: false,
    },
    createdAt: '2025-04-09T16:52:17.969285',
  },
  {
    id: '01961988-99b7-7539-9b18-9e607c0ac387',
    type: 'chat',
    memberMessage: {
      content: '',
      prompt: '안녕',
    },
    assistantMessage: {
      content:
        '안녕하세요! SF 로맨스 영화 시나리오 공모전 출품을 위한 AI 비서입니다. 설정 정보를 바탕으로 최대한 도움이 되는 답변을 드리겠습니다. 어떤 점이 궁금하신가요? 시나리오 작성에 필요한 정보, 아이디어 구체화, 캐릭터 설정 등 무엇이든 편하게 질문해주세요.  어떤 모습인가요? 기술신앙은 어떤 특징을 가지고 있나요? 미치나요? 사랑이라는 주제를 어떻게 풀어나갈 수 있을까요? 《허(Her)》나 《이터널 선샤인》과 차별화되는 요소는 무엇일까요?',
      isApplied: false,
    },
    createdAt: '2025-04-09T16:51:44.826282',
  },
  {
    id: '01961987-d363-730d-8571-70ac135e2002',
    type: 'auto modify',
    memberMessage: {
      content: '하지만 한 CEO는 진짜 감정을 지닌 AI를 만들려 한다.',
      prompt: null,
    },
    assistantMessage: {
      content: '하지만 한 CEO는 진짜 감정을 가진 AI를 만들려 한다.',
      isApplied: false,
    },
    createdAt: '2025-04-09T16:50:54.054138',
  },
  {
    id: '01961985-b46f-70fd-b93a-08a6e7ad6365',
    type: 'user modify',
    memberMessage: {
      content: 'AI가 감정을 흉내 내는 세상',
      prompt: '문장 다듬어줘',
    },
    assistantMessage: {
      content: 'AI가 감정을 모방하는 세상',
      isApplied: false,
    },
    createdAt: '2025-04-09T16:48:35.058694',
  },
  {
    id: '01961983-af6e-757a-a390-bfa6f80333c9',
    type: 'user modify',
    memberMessage: {
      content: 'AI가 감정을 흉내 내는 세상',
      prompt: '문장 다듬어줘',
    },
    assistantMessage: {
      content: 'AI가 감정을 모방하는 세상',
      isApplied: false,
    },
    createdAt: '2025-04-09T16:46:22.705103',
  },
  {
    id: '01961982-7cf1-78c5-9661-ab9e936884a8',
    type: 'feedback',
    memberMessage: {
      content:
        'AI가 감정을 흉내 내는 세상. 하지만 한 CEO는 진짜 감정을 지닌 AI를 만들려 한다. 문장 수정해줘',
      prompt: null,
    },
    assistantMessage: {
      content:
        'AI가 감정을 흉내 내는 세상. 그 속에서 한 CEO는 진짜 감정을 지닌 AI를 만들려 한다.:했습니다.  단순히 마침표로 연결된 것보다 맥락상 더 매끄럽게 이어지도록 했습니다.  원문의 간결한 스타일을 유지하면서 문장 간의 관계를 명확히 드러냈습니다.',
      isApplied: false,
    },
    createdAt: '2025-04-09T16:45:04.245849',
  },
]

export default function ChatbotChatItems() {
  return (
    <>
      {CHATS.map((item) => (
        <ChatbotChatItem key={item.id} {...item} />
      ))}
    </>
  )
}
