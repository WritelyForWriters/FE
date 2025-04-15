import { QueryKey, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'

// useMutation 옵션을 사용하기 위한 커스텀 타입
export type UseMutationCustomOptions<TData = unknown, TVariables = unknown> = Omit<
  UseMutationOptions<TData, Error, TVariables, unknown>,
  'mutationFn'
>

// useQuery 옵션을 사용하기 위한 커스텀 타입
export type UseQueryCustomOptions<TQueryFnData = unknown, TData = TQueryFnData> = Omit<
  UseQueryOptions<TQueryFnData, Error, TData, QueryKey>,
  'queryKey'
>
