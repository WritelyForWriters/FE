import { PlannerTabType } from '(after-login)/planner/[id]/types/plannerTab'

export const PLANNER_TABS: PlannerTabType[] = [
  {
    label: '시놉시스',
    value: 'synopsis',
  },
  {
    label: '아이디어 노트',
    value: 'idea',
  },
]

export const PLANNER_WORLD_VIEW_ITEMS = [
  {
    itemId: 'planner-world-view-item-0',
    label: '지리/환경',
    name: 'worldView.geography',
    helperText: '지역 이름, 지형, 기후, 자원, 주요 장소',
  },
  {
    itemId: 'planner-world-view-item-1',
    label: '역사',
    name: 'worldView.history',
    helperText: '발생 연도, 제목, 내용, 발생 지역, 중심 인물, 영향, 유물',
  },
  {
    itemId: 'planner-world-view-item-2',
    label: '정치',
    name: 'worldView.politics',
    helperText:
      '권력 구조 (이념, 정치 체제, 주요 집단/인물) 법/규제 (사법 체계, 적용 범위, 주요 법률)',
  },
  {
    itemId: 'planner-world-view-item-3',
    label: '사회',
    name: 'worldView.society',
    helperText: '계급 구조, 가족 구조',
  },
  {
    itemId: 'planner-world-view-item-4',
    label: '종교/신화',
    name: 'worldView.religion',
    helperText: '종교 이름, 교리, 상징, 의식',
  },
  {
    itemId: 'planner-world-view-item-5',
    label: '경제',
    name: 'worldView.economy',
    helperText:
      '산업 (발전 수준, 사용 기술 및 자원, 주요 기업/인물),\n화폐 (종류, 단위, 공급 및 유통),\n무역 (거래 상품, 무역 경로, 무역 파트너, 관세 및 규제)',
  },
  {
    itemId: 'planner-world-view-item-6',
    label: '기술',
    name: 'worldView.technology',
    helperText: '주요 기술, 기술 수준, 기술 사용처(교통, 의학, 에너지 등)',
  },
  {
    itemId: 'planner-world-view-item-7',
    label: '생활',
    name: 'worldView.lifestyle',
    helperText: '주거지, 의복, 음식',
  },
  {
    itemId: 'planner-world-view-item-8',
    label: '언어',
    name: 'worldView.language',
    helperText: '언어/사투리, 알파벳, 속어',
  },
  {
    itemId: 'planner-world-view-item-9',
    label: '문화',
    name: 'worldView.culture',
    helperText: '축제, 예술, 의식',
  },
  {
    itemId: 'planner-world-view-item-10',
    label: '종족/인종',
    name: 'worldView.species',
    helperText: '종족/인종 이름, 역사, 외모, 문화, 거주지',
  },
  {
    itemId: 'planner-world-view-item-11',
    label: '직업',
    name: 'worldView.occupation',
    helperText: '직업 이름, 하는 일, 보수, 인식',
  },
  {
    itemId: 'planner-world-view-item-12',
    label: '갈등 관계',
    name: 'worldView.conflict',
    helperText: '갈등 주체, 원인, 주요 사건, 현재 상황',
  },
]

export const PLANNER_CHARACTER_ITEMS = [
  {
    itemId: 'planner-character-item-0',
    label: '인물 소개',
    name: 'character.intro',
  },
  {
    itemId: 'planner-character-item-1',
    label: '이름',
    name: 'character.name',
  },
  {
    itemId: 'planner-character-item-2',
    label: '나이',
    name: 'character.age',
  },
  {
    itemId: 'planner-character-item-3',
    label: '성별',
    name: 'character.gender',
  },
  {
    itemId: 'planner-character-item-4',
    label: '직업',
    name: 'character.occuption',
  },
  {
    itemId: 'planner-character-item-5',
    label: '외모',
    name: 'character.appearance',
  },
  {
    itemId: 'planner-character-item-6',
    label: '성격/특징',
    name: 'character.personality',
  },
  {
    itemId: 'planner-character-item-7',
    label: '주요 관계',
    name: 'character.relationship',
  },
]
