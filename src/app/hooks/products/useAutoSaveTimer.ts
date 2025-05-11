import { useCallback, useEffect, useRef, useState } from 'react'

export const useAutoSaveTimer = (initialTime = 300000) => {
  const [autoSaveTimer, setAutoSaveTimer] = useState(initialTime)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [])

  const decrementTimer = useCallback(
    (time: number) => {
      if (time > 1000) {
        return time - 1000
      } else {
        stopTimer()
        setTimeout(() => {
          setAutoSaveTimer(initialTime)
        }, 3000)
        return 0
      }
    },
    [stopTimer, initialTime],
  )

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setAutoSaveTimer((prevTime) => decrementTimer(prevTime))
    }, 1000)
  }, [decrementTimer])

  useEffect(() => {
    startTimer()

    return () => {
      stopTimer()
    }
  }, [startTimer, stopTimer])

  return {
    autoSaveTimer,
    startTimer,
    stopTimer,
    resetTimer: () => setAutoSaveTimer(initialTime),
  }
}
