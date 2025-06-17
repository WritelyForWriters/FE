import { useCallback, useEffect, useRef, useState } from 'react'

export const useAutoSaveTimer = (initialTime = 300000) => {
  const [autoSaveTimer, setAutoSaveTimer] = useState(initialTime)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const currentTimeRef = useRef(initialTime)

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const resetTimer = useCallback(() => {
    currentTimeRef.current = initialTime
    setAutoSaveTimer(initialTime)
  }, [initialTime])

  const startTimer = useCallback(() => {
    stopTimer()

    timerRef.current = setInterval(() => {
      if (currentTimeRef.current > 1000) {
        currentTimeRef.current -= 1000
        setAutoSaveTimer(currentTimeRef.current)
      } else {
        stopTimer()
        setAutoSaveTimer(0)
        setTimeout(() => {
          resetTimer()
          startTimer()
        }, 3000)
      }
    }, 1000)
  }, [stopTimer, resetTimer])

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
