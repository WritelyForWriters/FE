import { CHATBOT_DEFAULT_SIZE } from 'constants/chatbot/number'

export const computeChatbotPosition = (faviconX: number, faviconY: number) => {
  let computedX, computedY

  if (faviconX >= CHATBOT_DEFAULT_SIZE.width) {
    computedX = faviconX - CHATBOT_DEFAULT_SIZE.width
  } else {
    computedX = faviconX
  }

  if (faviconY >= CHATBOT_DEFAULT_SIZE.height) {
    computedY = faviconY - CHATBOT_DEFAULT_SIZE.height
  } else {
    computedY = faviconY
  }

  return { x: computedX, y: computedY }
}
