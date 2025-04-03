import { useMutation } from '@tanstack/react-query'
import { sendChangePasswordToken } from 'api/auth/Auth'
import axios from 'axios'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'

import { useToast } from '@components/toast/ToastProvider'

export const useFindPassword = () => {
  const showToast = useToast()

  return useMutation({
    mutationFn: sendChangePasswordToken,
    onSuccess: () => {
      showToast('success', TOAST_MESSAGE.FIND_PASSWORD_COMPLETE)
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const { code, status, response } = error

        if (code === 'ERR_NETWORK') {
          showToast('warning', TOAST_MESSAGE.NETWORK_ERROR)
        }

        if (status === 404) {
          showToast('warning', response?.data.message)
        }
      }
    },
  })
}
