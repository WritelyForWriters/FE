import { Placement } from 'react-joyride'

export const BEFORE_LOGIN_TUTORIAL_STEPS = [
  {
    target: 'body',
    title: '라이트온에 오신 것을 환영합니다! \n 같이 한 번 둘러볼까요?',
    content: '튜토리얼을 시작하려면 아무 키나 눌러주세요.',
    placement: 'center' as Placement,
    disableBeacon: true,
  },
  {
    target: '.library-step-1',
    content: '여기서 글쓰기를 시작할 수 있어요.',
    placement: 'bottom' as Placement,
    disableBeacon: true,
  },
  {
    target: '.library-step-2',
    content: '바로 작품 쓰기를 시작할 수 있어요.',
    placement: 'left' as Placement,
    disableBeacon: true,
  },
  {
    target: '.library-step-3',
    content: '작품을 먼저 기획할 수 있어요.',
    placement: 'left' as Placement,
    disableBeacon: true,
  },
  {
    target: '.library-step-4',
    content: '작품 본문을 읽고 편집할 수 있어요.',
    placement: 'right' as Placement,
    disableBeacon: true,
  },
  {
    target: '.library-step-5',
    content: '작품 설정을 읽고 편집할 수 있어요.',
    placement: 'right' as Placement,
    disableBeacon: true,
  },
  {
    target: 'body',
    title: '이제 진짜 작품을 \n 만들어 볼까요?',
    content: null,
    placement: 'center' as Placement,
    disableBeacon: true,
  },
]

export const AFTER_LOGIN_TUTORIAL_STEPS = [
  {
    target: '.library-step-0',
    content: '글쓰기 버튼을 클릭해보세요.',
    placement: 'left' as Placement,
    disableBeacon: true,
  },
  {
    target: '.library-step-1',
    content: '바로 작품 집필을 시작해요.',
    placement: 'left' as Placement,
    disableBeacon: true,
    spotlightClicks: true,
  },
  {
    target: '.library-step-2',
    content: '어떤 작품을 쓸지 계획해요.',
    placement: 'left' as Placement,
    disableBeacon: true,
    spotlightClicks: true,
  },
]

export const PLANNER_TUTORIAL_STEPS = [
  {
    target: '.planner-step-1',
    content: '어떤 장르의 이야기를 쓰고 싶으세요?',
    placement: 'bottom' as Placement,
    disableBeacon: true,
  },
  {
    target: '.planner-step-2',
    content:
      '한 문장으로 쓰고 싶은 이야기를 들려주세요. \n 아이디어가 필요하면 호버하여 오른쪽의 AI 버튼을 눌러 보세요.',
    placement: 'bottom' as Placement,
    disableBeacon: true,
  },
  {
    target: '.planner-step-3',
    content: '이제 저장만 하면 끝이에요!',
    placement: 'bottom' as Placement,
    disableBeacon: true,
  },
  {
    target: '.planner-step-4',
    content: '이제 집필하러 가볼까요?',
    placement: 'bottom' as Placement,
    disableBeacon: true,
    spotlightClicks: true,
  },
]
