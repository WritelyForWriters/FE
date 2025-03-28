import { TOAST_MESSAGE } from 'constants/common/toastMessage'
import { ChangePasswordFormData } from 'types/auth/changePassword'

const API_URL = process.env.NEXT_PUBLIC_API_URL

// 비밀번호 변경 토큰 전송
export const sendChangePasswordToken = async (email: string) => {
  try {
    const res = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      body: JSON.stringify({ email }),
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

// 비밀번호 변경 요청
export const changePassword = async (formData: ChangePasswordFormData) => {
  try {
    const res = await fetch(`${API_URL}/auth/change-password/complete`, {
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
