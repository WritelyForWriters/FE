import { CHATBOT_DEFAULT_SIZE } from 'constants/chatbot/number'

export const computeChatbotAbsolutePosition = (
  faviconX: number,
  faviconY: number,
  innerWidth: number,
  innerHeight: number,
) => {
  let computedX, computedY

  if (faviconX + CHATBOT_DEFAULT_SIZE.width >= innerWidth) {
    computedX = faviconX - CHATBOT_DEFAULT_SIZE.width
  } else {
    computedX = faviconX
  }

  if (faviconY + CHATBOT_DEFAULT_SIZE.height >= innerHeight) {
    computedY = faviconY - CHATBOT_DEFAULT_SIZE.height
  } else {
    computedY = faviconY
  }

  return { x: computedX, y: computedY }
}
