'use client'

import { useRouter } from 'next/navigation'

import { ReactNode, useEffect } from 'react'

import AuthAxios from 'api/core/AuthInstance'
import { NUMERICS } from 'constants/common/numberValue'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'
import { setCookie } from 'cookies-next/client'
import { useAtom, useAtomValue } from 'jotai'
import { accessTokenAtom } from 'store/accessTokenAtom'
import { isRemberMeAtom } from 'store/isRemberMeAtom'

import { useToast } from '@components/toast/ToastProvider'

import { useRefresh } from '@hooks/index'

interface AuthInterceptorProps {
  children: ReactNode
}

let isTokenRefreshing = false
let refreshSubscribers: ((newAccessToken: string) => void)[] = []

const onTokenRefreshed = (newAccessToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken))
  refreshSubscribers = []
}

export default function AuthInterceptor({ children }: AuthInterceptorProps) {
  const router = useRouter()
  const showToast = useToast()

  const [accessToken, setAccessToken] = useAtom(accessTokenAtom)
  const isRememberMe = useAtomValue(isRemberMeAtom)

  const { mutateAsync: refresh } = useRefresh({
    onSuccessHandler: () => {
      const date = new Date()
      date.setTime(date.getTime() + NUMERICS.COOKIE_EXPIRE)
      setCookie('isLoggedIn', true, isRememberMe ? { expires: date, path: '/' } : {})
    },
    onErrorHandler: () => {
      showToast('warning', TOAST_MESSAGE.SESSION_DONE)
      router.replace('/login')
    },
  })

  useEffect(() => {
    const requestInterceptorId = AuthAxios.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    return () => {
      AuthAxios.interceptors.request.eject(requestInterceptorId)
    }
  }, [accessToken])

  useEffect(() => {
    const responseInterceptorId = AuthAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const {
          config: originalRequest,
          response: { status },
        } = error

        if (status !== 401 && status !== 404) {
          if (error.code === 'ERR_NETWORK') {
            showToast('warning', TOAST_MESSAGE.NETWORK_ERROR)
          }
          return Promise.reject(error)
        }

        if (isTokenRefreshing) {
          return new Promise((resolve) => {
            refreshSubscribers.push((newAccessToken: string) => {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
              resolve(AuthAxios(originalRequest))
            })
          })
        }

        isTokenRefreshing = true

        try {
          const newAccessToken = await refresh()

          if (newAccessToken) {
            setAccessToken(newAccessToken)
            onTokenRefreshed(newAccessToken)

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return AuthAxios(originalRequest)
          }
        } catch (refreshError) {
          return Promise.reject(refreshError)
        } finally {
          isTokenRefreshing = false
        }

        return Promise.reject(error)
      },
    )

    return () => {
      AuthAxios.interceptors.response.eject(responseInterceptorId)
    }
  }, [refresh, router, showToast, setAccessToken])

  return <>{children}</>
}
