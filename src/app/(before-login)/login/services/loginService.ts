import { TOAST_MESSAGE } from 'constants/common/toastMessage'

import { LoginFormData } from '../types/login'

const API_URL = process.env.NEXT_PUBLIC_API_URL

// AT 갱신
export const refreshAccessToken = async () => {
  const res = await fetch(`${API_URL}/auth/token/reissue`, {
    method: 'POST',
    credentials: 'include',
  })

  const data = await res.json()

  if (data.code === 'RESULT-001') {
    return data.result
  } else {
    throw new Error()
  }
}

// 로그인
export const login = async (formData: LoginFormData) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()

    return data
  } catch {
    const error = new Error()
    error.message = TOAST_MESSAGE.NETWORK_ERROR
    throw error
  }
}
