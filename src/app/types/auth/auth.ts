export type InputType = 'email' | 'nickname'

export interface AuthResponse {
  code: string
  result: {
    accessToken: string
  }
  message: string
}

export interface CheckDuplicateResponse {
  result: {
    value: string
    exists: boolean
  }
}

export interface JoinFormFieldValues {
  email: string
  nickname: string
  password: string
  confirmPassword: string
  allAgree: boolean
  termsOfService: boolean
  privacyPolicy: boolean
  marketingReceive: boolean
}

export interface Term {
  termsCd: string
  isAgreed: boolean
}

export enum Terms {
  PRIVACY_POLICY = '1001', // 개인정보 처리 방침
  MARKETING_RECEIVE = '1002', // 마케팅 정보 수신
  TERMS_OF_SERVICE = '1003', // 이용 약관
}

export interface JoinFormData {
  email: string
  password: string
  nickname: string
  termsList: Term[]
}

export interface ChangePasswordFormValues {
  password: string
  confirmPassword: string
}

export interface ChangePasswordFormData {
  changePasswordToken: string
  password: string
}

export interface LoginFormFieldValues {
  email: string
  password: string
  isRememberMe: boolean
}
