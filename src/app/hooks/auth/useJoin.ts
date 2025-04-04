import { useMutation } from '@tanstack/react-query'
import { join } from 'api/auth/Auth'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'

import { useToast } from '@components/toast/ToastProvider'

import { handleAxiosError } from '@utils/handleAxiosError'

interface UseJoinProps {
  onSuccessHandler: () => void
}

export const useJoin = ({ onSuccessHandler }: UseJoinProps) => {
  const showToast = useToast()

  return useMutation({
    mutationFn: join,
    onSuccess: () => {
      onSuccessHandler()
      showToast('success', TOAST_MESSAGE.SIGN_UP_COMPLETE)
    },
    onError: (error) => {
      handleAxiosError(error, showToast)
    },
  })
}
