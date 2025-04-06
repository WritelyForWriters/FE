import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEY } from 'constants/common/queryKeys'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'
import { saveProduct } from 'services/products/products'
import { UseMutationCustomOptions } from 'types/common/reactQueryCustomOption'

import { useToast } from '@components/toast/ToastProvider'

const useSaveProduct = (mutationOptions?: UseMutationCustomOptions) => {
  return useMutation({
    mutationFn: saveProduct,
    ...mutationOptions,
  })
}

export const useProducts = () => {
  const queryClient = useQueryClient()
  const showToast = useToast()

  const saveProductMutation = useSaveProduct({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.PRODUCT_LIST],
      })
      showToast('success', TOAST_MESSAGE.SUCCESS_SAVE_PRODUCT)
    },
    onError: () => {
      showToast('success', TOAST_MESSAGE.FAIL_SAVE_PRODUCT)
    },
  })

  return {
    saveProductMutation,
  }
}
