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
  PRIVACY_POLICY_AGREEMENT = '1001', // 개인정보 처리 방침
  MARKETING_RECEIVE_AGREEMENT = '1002', // 마케팅 정보 수신
  TERMS_OF_SERVICE_AGREEMENT = '1003', // 이용 약관
}

export interface JoinFormData {
  email: string
  password: string
  nickname: string
  termsList: Term[]
}
