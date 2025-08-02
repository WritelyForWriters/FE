import { useEffect } from 'react'

import { useAtomValue } from 'jotai'
import { goalReachedAtom, typedCharCountAtom } from 'store/charCountAtom'

// TODO: 스타일 수정!!
// import styles from './CharCounter.module.scss'

interface CharCounterProps {
  onGoalReached?: () => void
}

export default function CharCounter({ onGoalReached }: CharCounterProps) {
  const typedCharCount = useAtomValue(typedCharCountAtom)
  const goalReached = useAtomValue(goalReachedAtom)

  useEffect(() => {
    if (goalReached && onGoalReached) {
      onGoalReached()
    }
  }, [goalReached, onGoalReached])

  return (
    <div>
      <span>{typedCharCount}자</span> / <span>700자</span>
    </div>
  )
}
