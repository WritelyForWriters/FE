import { JoinFormData, LoginFormData } from 'types/auth/join'

const url = process.env.NEXT_PUBLIC_API_URL

// 중복 확인
export const checkValueDuplicate = async (type: 'email' | 'nickname', value: string) => {
  try {
    const res = await fetch(`${url}/auth/check-${type}?${type}=${value}`, {
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
    const res = await fetch(`${url}/auth/join`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()

    if (data.code === 'RESULT-001') {
      return true
    }
  } catch {}
}

// 로그인
export const login = async (formData: LoginFormData) => {
  try {
    const res = await fetch(`${url}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()

    if (data.code === 'RESULT-001') {
      return true
    }
  } catch {}
}
