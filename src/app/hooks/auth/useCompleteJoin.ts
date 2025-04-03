import { useMutation } from '@tanstack/react-query'
import { completeJoin } from 'api/auth/Auth'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'

import { useToast } from '@components/toast/ToastProvider'

interface UseCompleteJoinProps {
  onSettledHandler: () => void
}

export const useCompleteJoin = ({ onSettledHandler }: UseCompleteJoinProps) => {
  const showToast = useToast()

  return useMutation({
    mutationFn: completeJoin,
    onSuccess: () => {
      showToast('success', TOAST_MESSAGE.ACCOUNT_ACTIVATION_SUCCESS)
    },
    onSettled: () => {
      onSettledHandler()
    },
  })
}
