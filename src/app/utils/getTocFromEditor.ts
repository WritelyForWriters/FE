import { JSONContent } from '@tiptap/react'
import { TocItemType } from 'types/common/pannel'

/**
 * Editor Content에서 heading을 추출해서 toc를 만드는 유틸 함수
 * @param node JSON 형식으로 변환된 Editor 콘텐츠
 * @returns node
 */
export const getTocFromEditor = (node: JSONContent) => {
  const toc: TocItemType[] = []

  if (node.content) {
    node.content.forEach((node) => {
      if (node.type === 'heading' && node.attrs?.id) {
        // 서식, 줄바꿈이 적용된 제목의 경우 content가 배열로 저장되므로 합쳐서 하나의 문자열로 저장되도록
        const title = node.content?.map((value) => value.text).join('') || ''
        if (!title.trim()) return // 제목이 없는 경우
        toc.push({ id: node.attrs.id, title })
      }
    })
  }
  return toc
}
