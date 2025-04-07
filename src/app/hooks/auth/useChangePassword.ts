import { useMutation } from '@tanstack/react-query'
import { changePassword } from 'api/auth/Auth'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'

import { useToast } from '@components/toast/ToastProvider'

import { handleAxiosError } from '@utils/handleAxiosError'

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
      handleAxiosError(error, showToast)
    },
  })
}
