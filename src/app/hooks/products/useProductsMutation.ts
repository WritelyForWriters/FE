import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProductsTemplates, postProducts, saveProduct } from 'api/products/products'
import { QUERY_KEY } from 'constants/common/queryKeys'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'
import { FIRST_PRODUCT_COUNT } from 'constants/workspace/number'
import { useAtom } from 'jotai'
import { tutorialShownAtom } from 'store/workspaceTutorialAtom'
import { UseMutationCustomOptions } from 'types/common/reactQueryCustomOption'
import { PlannerTemplatesRequest } from 'types/planner/plannerTemplatesRequest'
import { ProductDto } from 'types/products'

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
  const [tutorialShown, setTutorialShown] = useAtom(tutorialShownAtom)

  // 작품 생성
  const createProductIdMutation = useCreateProductId({
    onSuccess: async () => {
      // 작품 목록을 가져와서 개수 확인
      const productList: ProductDto[] = await queryClient.fetchQuery({
        queryKey: [QUERY_KEY.PRODUCT_LIST],
      })

      // 첫 작품인 경우 튜토리얼 표시 설정
      if (productList && productList.length === FIRST_PRODUCT_COUNT && !tutorialShown) {
        setTutorialShown(false)
      }

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
