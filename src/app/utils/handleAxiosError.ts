import axios from 'axios'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'

type ShowToastFn = (type: 'warning', message: string) => void

export const handleAxiosError = (error: Error, showToast: ShowToastFn) => {
  if (axios.isAxiosError(error)) {
    const { code, response } = error

    if (code === 'ERR_NETWORK') {
      showToast('warning', TOAST_MESSAGE.NETWORK_ERROR)
    } else if (response?.status === 400) {
      showToast('warning', TOAST_MESSAGE.LOGIN_FAIL)
    } else {
      showToast('warning', response?.data.message || TOAST_MESSAGE.UNKNOWN_ERROR)
    }
  } else {
    showToast('warning', TOAST_MESSAGE.UNKNOWN_ERROR)
  }
}
