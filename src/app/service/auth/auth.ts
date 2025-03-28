import { TOAST_MESSAGE } from 'constants/common/toastMessage'
import { JoinFormData } from 'types/auth/join'
import { LoginFormData } from 'types/auth/login'

const API_URL = process.env.NEXT_PUBLIC_API_URL

// AT 갱신
// TODO: API 수정 후 RT 관련 코드 삭제
export const refreshAccessToken = async (refreshToken: string) => {
  const res = await fetch(`${API_URL}/auth/token/reissue`, {
    method: 'POST',
    body: JSON.stringify({
      refreshToken,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()

  if (data.code === 'RESULT-001') {
    return data.result
  } else {
    throw new Error()
  }
}

// 중복 확인
export const checkValueDuplicate = async (type: 'email' | 'nickname', value: string) => {
  try {
    const res = await fetch(`${API_URL}/auth/check-${type}?${type}=${value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()

    if (data.code === 'RESULT-001') {
      return data.result.exists
    }
  } catch {}
}

// 회원가입
export const join = async (formData: JoinFormData) => {
  try {
    const res = await fetch(`${API_URL}/auth/join`, {
      method: 'POST',
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

// 로그인
export const login = async (formData: LoginFormData) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
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
