import { useQuery } from '@tanstack/react-query'
import { getMemoList } from 'api/memos/memos'
import { QUERY_KEY } from 'constants/common/queryKeys'
import { UseQueryCustomOptions } from 'types/common/reactQueryCustomOption'
import { MemosDto } from 'types/memos'

export const useGetMemoList = (
  productId: string,
  queryOptions?: UseQueryCustomOptions<MemosDto[]>,
) => {
  return useQuery({
    queryKey: [QUERY_KEY.MEMO_LIST, productId],
    queryFn: () => getMemoList(productId),
    enabled: !!productId,
    ...queryOptions,
  })
}
