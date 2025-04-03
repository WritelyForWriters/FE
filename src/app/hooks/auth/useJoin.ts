import { useMutation } from '@tanstack/react-query'
import { join } from 'api/auth/Auth'
import axios from 'axios'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'

import { useToast } from '@components/toast/ToastProvider'

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
      if (axios.isAxiosError(error)) {
        const { code, status, response } = error

        if (code === 'ERR_NETWORK') {
          showToast('warning', TOAST_MESSAGE.NETWORK_ERROR)
        }

        if (status === 401) {
          showToast('warning', response?.data.message)
        }
      }
    },
  })
}
