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
