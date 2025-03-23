import { ProfileDto } from 'types/members'

export const getMeProfile = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/members/me/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      },
    })

    const data: ProfileDto = await res.json()

    if (data.code === 'RESULT-001') {
      return data.result
    }
  } catch (error) {
    console.error('프로필 조회 실패: ', error)
  }
}
