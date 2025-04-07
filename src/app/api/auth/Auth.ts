import Axios from 'api/core/Instance'
import {
  AuthResponse,
  ChangePasswordFormData,
  CheckDuplicateResponse,
  InputType,
  JoinFormData,
  LoginFormFieldValues,
} from 'types/auth/auth'

// 액세스 토큰 재발급
export const refreshAccessToken = async () => {
  const res = await Axios.post<AuthResponse>('/auth/token/reissue')

  return res.data.result.accessToken
}

// 로그인
export const login = async (formData: LoginFormFieldValues) => {
  const res = await Axios.post<AuthResponse>('/auth/login', {
    email: formData.email,
    password: formData.password,
  })

  return res.data
}

// (이메일 | 닉네임) 중복 확인
export const checkValueDuplicate = async (type: InputType, value: string) => {
  const res = await Axios.get<CheckDuplicateResponse>(`/auth/check-${type}?${type}=${value}`)

  return res.data.result
}

// 회원가입
export const join = async (formData: JoinFormData) => {
  const res = await Axios.post('/auth/join', { ...formData })

  return res.data
}

// 이메일 인증 처리
export const completeJoin = async (joinToken: string) => {
  await Axios.post('/auth/join/complete', { joinToken })
}

// 비밀번호 찾기
export const sendChangePasswordToken = async (email: string) => {
  await Axios.post('/auth/change-password', {
    email,
  })
}

// 비밀번호 변경
export const changePassword = async (formData: ChangePasswordFormData) => {
  await Axios.post(`/auth/change-password/complete`, { ...formData })
}
