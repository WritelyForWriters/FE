import { useEffect } from 'react'

import { CURRENT_GOAL } from 'constants/workspace/number'
import { useAtomValue } from 'jotai'
import { goalReachedAtom, typedCharCountAtom } from 'store/charCountAtom'

// TODO: 스타일 수정!!
// import styles from './CharCounter.module.scss'

interface CharCounterProps {
  productId: string
  onGoalReached?: () => void
}

export default function CharCounter({ productId, onGoalReached }: CharCounterProps) {
  const typedCharCount = useAtomValue(typedCharCountAtom)
  const goalReached = useAtomValue(goalReachedAtom)

  const sessionKey = `product-${productId}-char-count`
  const sessionData = JSON.parse(sessionStorage.getItem(sessionKey) || '{}')

  useEffect(() => {
    if (goalReached && onGoalReached) {
      onGoalReached()
    }
  }, [goalReached, onGoalReached])

  return (
    <div>
      <span>{typedCharCount}자</span> / <span>{sessionData.currentGoal || CURRENT_GOAL}자</span>
    </div>
  )
}
