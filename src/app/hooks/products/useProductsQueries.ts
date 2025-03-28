import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from 'constants/common/queryKeys'
import { getProductList } from 'services/products/products'
import { UseQueryCustomOptions } from 'types/common/reactQueryCustomOption'
import { ProductDto } from 'types/products'

export const useGetProductList = (queryOptions?: UseQueryCustomOptions<ProductDto[]>) => {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCT_LIST],
    queryFn: getProductList,
    staleTime: 1000 * 60 * 5, // 5분
    ...queryOptions,
  })
}
