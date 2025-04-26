export const QUERY_KEY = Object.freeze({
  // 작품
  PRODUCT_LIST: 'getProductList',
  PRODUCT_DETAIL: 'getProductDetail',

  // 프로필
  ME_PROFILE: 'getMeProfile',

  // 챗봇
  ASSISTANT_HISTORY: (productId: string) => ['assistant-history', productId],
  FAVORITE_PROMPTS: (productId: string) => ['favorite-prompts', productId],
  FIXED_MESSAGE: (productId: string) => ['fixed-message', productId],
})
