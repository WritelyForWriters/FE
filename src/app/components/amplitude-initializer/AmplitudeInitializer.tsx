'use client'

import { useEffect } from 'react'

import { initAmplitude } from 'lib/amplitude'

export default function AmplitudeInitializer() {
  useEffect(() => {
    initAmplitude()
  }, [])

  return null
}
