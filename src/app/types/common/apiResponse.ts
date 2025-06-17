// API Response의 공통 타입
export interface ApiResponse<T> {
  code: string // TODO code type enum으로 변경하기
  message: string
  result: T
}
