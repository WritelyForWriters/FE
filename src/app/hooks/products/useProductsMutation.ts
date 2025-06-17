import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProductsTemplates, postProducts, saveProduct } from 'api/products/products'
import { QUERY_KEY } from 'constants/common/queryKeys'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'
import { UseMutationCustomOptions } from 'types/common/reactQueryCustomOption'
import { PlannerTemplatesRequest } from 'types/planner/plannerTemplatesRequest'

import { useToast } from '@components/toast/ToastProvider'

const useSaveProduct = (mutationOptions?: UseMutationCustomOptions) => {
  return useMutation({
    mutationFn: saveProduct,
    ...mutationOptions,
  })
}

const useCreateProductId = (mutationOptions?: UseMutationCustomOptions) => {
  return useMutation({
    mutationFn: postProducts,
    ...mutationOptions,
  })
}

export const useProducts = () => {
  const queryClient = useQueryClient()
  const showToast = useToast()

  // 작품 생성
  const createProductIdMutation = useCreateProductId({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.PRODUCT_LIST],
      })
    },
  })

  // 적품 저장
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
    createProductIdMutation,
    saveProductMutation,
  }
}

export const useCreateProductTemplates = (mutationOptions?: UseMutationCustomOptions) => {
  return useMutation({
    mutationFn: ({ productId, request }: { productId: string; request: PlannerTemplatesRequest }) =>
      createProductsTemplates(productId, request),
    ...mutationOptions,
  })
}
