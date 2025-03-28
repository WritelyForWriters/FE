import { ProductIdResponseType, ProductListResponseType, SaveProductDataType } from 'types/products'

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

    const data: ProductIdResponseType = await res.json()

    if (data.code === 'RESULT-001') {
      return data.result
    }
  } catch (error) {
    console.error('작품 생성 실패: ', error)
  }
}

// 작품 목록 조회
export const getProductList = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
    },
    // MEMO(Sohyun): Next.js v15에서 cache의 default option은 auto no cache
    // no cache: 개발에서는 항상 새로 fetch, 프로덕션에서는 SSG이면 빌드 시 fetch, 동적 요청이면 매 요청 fetch
    // 작품 목록 조회의 경우 자주 변경되는 데이터가 아니므로 즉, 캐시를 저장하고 사용할때 검증(조건에 따라 fetch)하는 방식인 no cache 옵션 사용
  })

  const data: ProductListResponseType = await res.json()

  if (data.code === 'RESULT-001') {
    return data.result
  } else {
    throw new Error('작품 목록 조회 실패') // React-Query에서 에러를 받도록 처리
  }
}

interface SaveProductType {
  productId: string
  product: SaveProductDataType
}

// 작품 저장
export const saveProduct = async ({ productId, product }: SaveProductType) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(product),
    })

    const data = await res.json()

    if (data.code === 'RESULT-001') {
      return data.result
    }
  } catch (error) {
    console.error('작품 저장 실패: ', error)
  }
}
