import { JoinFormData } from '(before-login)/join/types/join'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'

const API_URL = process.env.NEXT_PUBLIC_API_URL

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
