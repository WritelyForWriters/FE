'use client'

import { useRouter } from 'next/navigation'

import { ReactNode, useEffect } from 'react'

import AuthAxios from 'api/core/AuthInstance'
import axios from 'axios'
import { NUMERICS } from 'constants/common/numberValue'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'
import { setCookie } from 'cookies-next/client'
import { useAtomValue } from 'jotai'
import { accessTokenAtom } from 'store/accessTokenAtom'
import { isRemberMeAtom } from 'store/isRemberMeAtom'

import { useToast } from '@components/toast/ToastProvider'

import { useRefresh } from '@hooks/index'

interface AuthInterceptorProps {
  children: ReactNode
}

export default function AuthInterceptor({ children }: AuthInterceptorProps) {
  const router = useRouter()
  const showToast = useToast()

  const accessToken = useAtomValue(accessTokenAtom)
  const isRememberMe = useAtomValue(isRemberMeAtom)

  const { mutateAsync: refresh } = useRefresh({
    onSuccessHandler: () => {
      const date = new Date()
      date.setTime(date.getTime() + NUMERICS.COOKIE_EXPIRE)
      setCookie('isLoggedIn', true, isRememberMe ? { expires: date, path: '/' } : {})
    },
    onErrorHandler: () => {
      router.replace('/login')
    },
  })

  const requestInterceptor = AuthAxios.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  })

  const responseInterceptor = AuthAxios.interceptors.response.use(
    (res) => res,
    async (error) => {
      const {
        code,
        config,
        response: { status },
      } = error

      if (code === 'ERR_NETWORK') {
        showToast('warning', TOAST_MESSAGE.NETWORK_ERROR)
      }

      if (status === 401) {
        await refresh()
        config.headers.Authorization = `Bearer ${accessToken}`
        return axios(config)
      }

      return Promise.reject(error)
    },
  )

  useEffect(() => {
    return () => {
      AuthAxios.interceptors.request.eject(requestInterceptor)
      AuthAxios.interceptors.response.eject(responseInterceptor)
    }
  }, [responseInterceptor, requestInterceptor])

  return <>{children}</>
}
