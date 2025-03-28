import Dashboard from '(after-login)/(bookself)/_components/Dashboard'
import MainHeader from '(after-login)/(bookself)/_components/MainHeader'
import { getProductList } from 'services/products/products'

/**
 * TODO
 * [ ] UI 점검
 * [ ] 인가 처리 -> 로그인 기능 완료 후
 * [ ] 로그인 여부에 따른 버튼 UI -> 로그인 기능 완료 후
 */

export default async function Home() {
  const productList = await getProductList()

  return (
    <div>
      <MainHeader productCount={productList?.length} />
      <Dashboard productList={productList} />
    </div>
  )
}
