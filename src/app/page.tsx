import Dashboard from '(after-login)/(bookself)/_components/Dashboard'
import MainHeader from '(after-login)/(bookself)/_components/MainHeader'
import { getProductList } from 'services/products/products'

/**
 * TODO
 * [ ] 내 정보 조회 API 연결
 * [x] 작품 생성 API 연결
 * [x] 작품 목록 조회 API 연결
 * [ ] 인가
 */

export default async function Home() {
  const productList = await getProductList()

  return (
    <div>
      <MainHeader />
      <Dashboard productList={productList} />
    </div>
  )
}
