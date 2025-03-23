export interface ProfileDto {
  code: string
  result: {
    email: string
    nickname: string
    profileImage: string | null
  }
  message: string
}
