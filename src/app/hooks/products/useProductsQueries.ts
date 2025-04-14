import { useQuery } from '@tanstack/react-query'
import { fetchProductsTemplates, getProductDetail, getProductList } from 'api/products/products'
import { QUERY_KEY } from 'constants/common/queryKeys'
import { UseQueryCustomOptions } from 'types/common/reactQueryCustomOption'
import { PlannerTemplates } from 'types/planner/plannerTemplatesResponse'
import { ProductDetailDto, ProductDto } from 'types/products'

export const useGetProductList = (queryOptions?: UseQueryCustomOptions<ProductDto[]>) => {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCT_LIST],
    queryFn: getProductList,
    staleTime: 1000 * 60 * 5, // 5분
    ...queryOptions,
  })
}

export const useGetProductDetail = (
  id: string,
  queryOptions?: UseQueryCustomOptions<ProductDetailDto>,
) => {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCT_LIST, id],
    queryFn: () => getProductDetail(id),
    ...queryOptions,
  })
}

export const useFetchProductTemplates = (
  productId: string,
  queryOptions?: UseQueryCustomOptions<PlannerTemplates>,
) => {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCT_TEMPLATES, productId],
    queryFn: () => fetchProductsTemplates(productId),
    ...queryOptions,
  })
}
