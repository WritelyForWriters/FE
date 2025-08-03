import { CURRENT_GOAL } from 'constants/workspace/number'
import { atom } from 'jotai'
import { atomFamily, atomWithStorage } from 'jotai/utils'
import { CharCountSession } from 'types/common/editor'

import { productIdAtom } from './productsAtoms'

// MEMO(Sohyun): 에디터 글자 수 카운트 관련 atom 정의

// 1. 작품별 글자 수 세션 정보 atom
export const charCountSessionAtomFamily = atomFamily((productId: string) => {
  console.log(productId) // 디버깅

  // atomWithStorage를 사용하여 세션 스토리지에 자동으로 저장 및 로드
  // atomWithStorage(key: string, initialValue, storage)
  return atomWithStorage<CharCountSession>(
    `product-${productId}-char-count`,
    {
      productId,
      initialCharCount: 0, // 세션 시작 시 글자 수
      currentGoal: CURRENT_GOAL, // 현재 목표 글자 수 (*TODO 700자로 수정)
      reachedGoals: [], // 달성한 목표들 기록
      sessionStartedAt: new Date().toISOString(), // 세션 시작 시간
    },
    {
      getItem: (key) => {
        const storedValue = sessionStorage.getItem(key)
        return storedValue ? JSON.parse(storedValue) : null
      },
      setItem: (key, value) => {
        sessionStorage.setItem(key, JSON.stringify(value))
      },
      removeItem: (key) => {
        sessionStorage.removeItem(key)
      },
    },
  )
})

// 2. 현재 글자 수 atom (에디터 상태와 연동)
export const currentCharCountAtom = atom(0)

// 3. 입력된 글자 수 계산 atom (현재 - 초기)
export const typedCharCountAtom = atom((get) => {
  const productId = get(productIdAtom)
  if (!productId) return 0

  const session = get(charCountSessionAtomFamily(productId))

  if (!session || session.initialCharCount === undefined) {
    return 0
  }

  const currentCount = get(currentCharCountAtom)
  return Math.max(0, currentCount - session.initialCharCount) // 현재 글자수 - 초기 글자수
})

// 4. 목표 달성 여부 atom
export const goalReachedAtom = atom((get) => {
  const productId = get(productIdAtom)
  if (!productId) return false

  const session = get(charCountSessionAtomFamily(productId))

  if (!session || session.initialCharCount === undefined) {
    return 0
  }

  const typedCount = get(typedCharCountAtom) // 입력된 글자수를 가져와서
  return typedCount >= session.currentGoal // 입력된 글자수가 목표 글자수보다 크거나 같으면 true
})

// 5. 목표 달성 모달 표시 여부 atom
export const goalModalVisibleAtom = atom(false)
