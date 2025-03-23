import { ProductIdDto, ProductListDto } from 'types/products'

// 작품 ID 생성
export const postProducts = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      },
    })

    const data: ProductIdDto = await res.json()

    if (data.code === 'RESULT-001') {
      return data.result
    }
  } catch (error) {
    console.error('작품 생성 실패: ', error)
  }
}

// 작품 목록 조회
export const getProductList = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      },
      // MEMO(Sohyun): Next.js v15에서 cache의 default option은 no-store(uncached requests)
      // 작품 목록 조회의 경우 no-cache 옵션 사용 vs 개인화된 요청에 따른 no-store 옵션 고민
    })

    const data: ProductListDto = await res.json()

    if (data.code === 'RESULT-001') {
      return data.result
    }
  } catch (error) {
    console.error('작품 목록 조회 실패: ', error)
  }
}
