import { CharacterFormValues } from 'types/planner/plannerSynopsisFormValues'

export const NEW_PLANNER_CHARACTER: CharacterFormValues = {
  id: '',
  intro: '',
  name: '',
  age: '',
  gender: '',
  occupation: '',
  appearance: '',
  personality: '',
  relationship: '',
  customFields: [
    {
      name: '',
      content: '',
    },
  ],
}

export const PLANNER_SYNOPSIS_GENRES = [
  {
    label: '일상',
    value: '일상',
  },
  {
    label: '드라마',
    value: '드라마',
  },
  {
    label: '판타지',
    value: '판타지',
  },
  {
    label: '공상과학',
    value: '공상과학',
  },
  {
    label: '추리/미스터리',
    value: '추리/미스터리',
  },
  {
    label: '로맨스',
    value: '로맨스',
  },
  {
    label: '코미디',
    value: '코미디',
  },
  {
    label: '시대극',
    value: '시대극',
  },
  {
    label: '호러',
    value: '호러',
  },
]

export const PLANNER_SYNOPSIS_LENGTH = [
  {
    label: '단편(50페이지 이하)',
    value: 'shortStory',
  },
  {
    label: '중편(50-200페이지)',
    value: 'novella',
  },
  {
    label: '장편(200페이지 이상)',
    value: 'novel',
  },
]

export const PLANNER_WORLD_VIEW_ITEMS = [
  {
    label: '지리/환경',
    name: 'geography',
    helperText: '지역 이름, 지형, 기후, 자원, 주요 장소',
  },
  {
    label: '역사',
    name: 'history',
    helperText: '발생 연도, 제목, 내용, 발생 지역, 중심 인물, 영향, 유물',
  },
  {
    label: '정치',
    name: 'politics',
    helperText:
      '권력 구조 (이념, 정치 체제, 주요 집단/인물) 법/규제 (사법 체계, 적용 범위, 주요 법률)',
  },
  {
    label: '사회',
    name: 'society',
    helperText: '계급 구조, 가족 구조',
  },
  {
    label: '종교/신화',
    name: 'religion',
    helperText: '종교 이름, 교리, 상징, 의식',
  },
  {
    label: '경제',
    name: 'economy',
    helperText:
      '산업 (발전 수준, 사용 기술 및 자원, 주요 기업/인물),\n화폐 (종류, 단위, 공급 및 유통),\n무역 (거래 상품, 무역 경로, 무역 파트너, 관세 및 규제)',
  },
  {
    label: '기술',
    name: 'technology',
    helperText: '주요 기술, 기술 수준, 기술 사용처(교통, 의학, 에너지 등)',
  },
  {
    label: '생활',
    name: 'lifestyle',
    helperText: '주거지, 의복, 음식',
  },
  {
    label: '언어',
    name: 'language',
    helperText: '언어/사투리, 알파벳, 속어',
  },
  {
    label: '문화',
    name: 'culture',
    helperText: '축제, 예술, 의식',
  },
  {
    label: '종족/인종',
    name: 'species',
    helperText: '종족/인종 이름, 역사, 외모, 문화, 거주지',
  },
  {
    label: '직업',
    name: 'occupation',
    helperText: '직업 이름, 하는 일, 보수, 인식',
  },
  {
    label: '갈등 관계',
    name: 'conflict',
    helperText: '갈등 주체, 원인, 주요 사건, 현재 상황',
  },
] as const

export const PLANNER_CHARACTER_ITEMS = [
  { label: '인물 소개', name: 'intro', manualModifiable: true },
  { label: '이름', name: 'name', manualModifiable: false },
  { label: '나이', name: 'age', manualModifiable: false },
  { label: '성별', name: 'gender', manualModifiable: false },
  { label: '직업', name: 'occupation', manualModifiable: false },
  { label: '외모', name: 'appearance', manualModifiable: false },
  { label: '성격/특징', name: 'personality', manualModifiable: false },
  { label: '주요 관계', name: 'relationship', manualModifiable: false },
  { label: '커스텀 필드', name: 'customFields', manualModifiable: true },
] as const
