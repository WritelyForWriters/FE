import { useMutation } from '@tanstack/react-query'
import { changePassword } from 'api/auth/Auth'
import axios from 'axios'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'

import { useToast } from '@components/toast/ToastProvider'

interface UseChangePasswordProps {
  onSuccessHandler: () => void
}

export const useChangePassword = ({ onSuccessHandler }: UseChangePasswordProps) => {
  const showToast = useToast()
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      onSuccessHandler()
      showToast('success', TOAST_MESSAGE.CHANGE_PASSWORD_COMPLETE)
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const { status, code, response } = error

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
