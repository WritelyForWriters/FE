import { JSONContent } from '@tiptap/react'
import { v4 as uuidv4 } from 'uuid'

/**
 * Editor의 제목(Heading)에 id 속성을 부여하는 유틸 함수
 * @param node JSON 형식으로 변환된 Editor 콘텐츠
 * @returns node
 */
export const addHeadingIds = (node: JSONContent) => {
  if (node.content) {
    node.content.map((node) => {
      if (node.type === 'heading') {
        node.attrs = {
          ...node.attrs,
          id: `heading-${uuidv4()}`,
        }
      }
    })
  }
  return node
}
