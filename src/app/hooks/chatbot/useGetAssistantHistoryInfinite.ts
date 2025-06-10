import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query'
import { getInfiniteAssistantHistory } from 'api/chatbot/chatbot'
import { QUERY_KEY } from 'constants/common/queryKeys'

export const useGetInfiniteAssistantHistory = (productId: string) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.ASSISTANT_HISTORY_INFINITE, productId],
    queryFn: ({ pageParam }: QueryFunctionContext) =>
      getInfiniteAssistantHistory({
        productId,
        cursor: pageParam as string | undefined,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.result.contents.length === 1) {
        return undefined
      }
      return lastPage.result.contents.at(-1)?.id
    },
    initialPageParam: undefined,
    enabled: !!productId,
  })
}
