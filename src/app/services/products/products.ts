import { PostProductsDto } from 'types/products'

export const postProducts = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      },
    })

    const data: PostProductsDto = await res.json()

    if (data.code === 'RESULT-001') {
      return data.result
    }
  } catch (error) {
    console.error('작품 생성 실패: ', error)
  }
}
