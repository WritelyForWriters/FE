import { init, setUserId, track } from '@amplitude/analytics-browser'

const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!

let isInitialized = false

export const initAmplitude = () => {
  if (!isInitialized) {
    init(AMPLITUDE_API_KEY)
    isInitialized = true
  }
}

export const trackEvent = (eventName: string, eventProperties?: Record<string, unknown>) => {
  if (!isInitialized) return
  track(eventName, eventProperties)
}

export const setAmplitudeUserId = (userId: string | null) => {
  if (!isInitialized) return
  if (userId) {
    setUserId(userId)
  } else {
    setUserId(undefined)
  }
}
