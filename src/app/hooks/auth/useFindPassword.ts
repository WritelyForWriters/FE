import { useMutation } from '@tanstack/react-query'
import { sendChangePasswordToken } from 'api/auth/Auth'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'

import { useToast } from '@components/toast/ToastProvider'

import { handleAxiosError } from '@utils/handleAxiosError'

export const useFindPassword = () => {
  const showToast = useToast()

  return useMutation({
    mutationFn: sendChangePasswordToken,
    onSuccess: () => {
      showToast('success', TOAST_MESSAGE.FIND_PASSWORD_COMPLETE)
    },
    onError: (error) => {
      handleAxiosError(error, showToast)
    },
  })
}
