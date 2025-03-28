import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEY } from 'constants/common/queryKeys'
import { getProductList, saveProduct } from 'services/products/products'
import {
  UseMutationCustomOptions,
  UseQueryCustomOptions,
} from 'types/common/reactQueryCustomOption'

const useGetProductList = (queryOptions?: UseQueryCustomOptions) => {
  return useQuery({
    queryKey: [QUERY_KEY.PRODUCT_LIST],
    queryFn: getProductList,
    staleTime: 1000 * 60 * 5, // 5분
    ...queryOptions,
  })
}

const useSaveProduct = (mutationOptions?: UseMutationCustomOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.PRODUCT_LIST],
      })
    },
    ...mutationOptions,
  })
}

export const useProducts = () => {
  const getProductListQuery = useGetProductList()
  const saveProductMutation = useSaveProduct()

  return {
    getProductListQuery,
    saveProductMutation,
  }
}
