import { Extension } from '@tiptap/core'

// editor heading에 id 속성을 추가하기 위해 만든 extension
const HeadingIdExtension = Extension.create({
  name: 'heading-id-extension',

  addGlobalAttributes() {
    return [
      {
        types: ['heading'], // heading node에 해당 extension을 적용
        attributes: {
          id: {
            default: null,
            parseHTML: (element) => element.getAttribute('id'), // HTML > JSON으로 변경할때 id 추출
            renderHTML: (attributes) => (attributes.id ? { id: attributes.id } : {}), // JSON > HTML 렌더링할 때, h1 태그에 id 적용
          },
        },
      },
    ]
  },
})

export default HeadingIdExtension
