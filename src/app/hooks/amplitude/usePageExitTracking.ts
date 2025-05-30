/**
 * 페이지 이탈 Tracking
 * @author 선우
 */
import { useEffect, useRef } from 'react'

import { trackEvent } from 'lib/amplitude'

export const usePageExitTracking = (page_name: string) => {
  const pageEnterTime = useRef<Date>(new Date())

  useEffect(() => {
    const handleRouteChange = () => {
      const time_spent = new Date().getTime() - pageEnterTime.current.getTime()

      trackEvent('page_exit', {
        page_name,
        time_spent,
      })
    }

    const handleBeforeUnload = () => {
      const time_spent = new Date().getTime() - pageEnterTime.current.getTime()

      trackEvent('page_exit', {
        page_name,
        time_spent,
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      handleRouteChange()
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])
}
