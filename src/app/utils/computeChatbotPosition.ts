import { CHATBOT_DEFAULT_SIZE } from 'constants/chatbot/number'

const MAX_VIEWPORT_HEIGHT_RATIO = 0.55

export const computeChatbotAbsolutePosition = (
  faviconX: number,
  faviconY: number,
  innerWidth: number,
  innerHeight: number,
) => {
  let computedX, computedY

  const chatbotWidth = CHATBOT_DEFAULT_SIZE.width
  const chatbotHeight = CHATBOT_DEFAULT_SIZE.height

  const maxChatbotViewportHeight = innerHeight * MAX_VIEWPORT_HEIGHT_RATIO

  if (faviconX + chatbotWidth > innerWidth) {
    computedX = faviconX - chatbotWidth
  } else {
    computedX = faviconX
  }

  computedY = faviconY

  if (computedY + chatbotHeight > maxChatbotViewportHeight) {
    computedY = maxChatbotViewportHeight - chatbotHeight
  }

  if (computedY < 0) {
    computedY = 0
  }

  return { x: computedX, y: computedY }
}
