import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEY } from 'constants/common/queryKeys'
import { saveProduct } from 'services/products/products'
import { UseMutationCustomOptions } from 'types/common/reactQueryCustomOption'

const useSaveProduct = (mutationOptions?: UseMutationCustomOptions) => {
  return useMutation({
    mutationFn: saveProduct,
    ...mutationOptions,
  })
}

export const useProducts = () => {
  const queryClient = useQueryClient()

  const saveProductMutation = useSaveProduct({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.PRODUCT_LIST],
      })
    },
  })

  return {
    saveProductMutation,
  }
}
