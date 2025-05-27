'use client'

import * as amplitude from '@amplitude/analytics-browser'

let initialized = false

export const initAmplitude = () => {
  if (typeof window === 'undefined') return
  if (initialized) return

  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY
  if (!apiKey) return

  // NOTE(hajae): 어떤 설정등이 있는지 확인 필요.
  // Default Tracking은 false로 설정했지만 추가 확인 후 true로 변경 가능
  amplitude.init(apiKey, {
    defaultTracking: false,
    autocapture: {
      elementInteractions: true,
    },
  })

  initialized = true
}

export { amplitude }
