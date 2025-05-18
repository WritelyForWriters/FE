import { Mark, mergeAttributes } from '@tiptap/core'

export interface BackgroundHighlightOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    backgroundHighlight: {
      setBackgroundHighlight: (attributes?: { color?: string }) => ReturnType
      unsetBackgroundHighlight: () => ReturnType
    }
  }
}

// Tiptap Mark를 확장하여 배경색 하이라이트 기능을 제공하는 Custom Extension
export const BackgroundHighlight = Mark.create<BackgroundHighlightOptions>({
  name: 'backgroundHighlight',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      color: {
        default: '#FFFAE5',
      },
    }
  },

  // MEMO(Sohyun): parseHTML()은 HTML에서 <mark> 태그를 파싱할 때, 그 태그가 배경 하이라이트용인지를 판단
  // HTML의 <mark> 태그 중 data-type이 "background"이거나 없는 경우만 BackgroundHighlight 마크로 인식
  // data-type="underline"인 경우는 UnderlineHighlight가 처리되도록 분리됨
  parseHTML() {
    return [
      {
        tag: 'mark',
        getAttrs: (node) => {
          const element = node as HTMLElement
          const type = element.getAttribute('data-type')
          // background 타입이거나 타입이 지정되지 않은 mark만 처리
          return !type || type === 'background' ? {} : false
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { color } = HTMLAttributes
    return [
      'mark',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-type': 'background',
        class: 'background-highlight',
        style: `background-color: ${color}; padding: 4px 1px; border-radius: 2px;`,
      }),
      0,
    ]
  },

  addCommands() {
    return {
      setBackgroundHighlight:
        (attributes = {}) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes)
        },
      unsetBackgroundHighlight:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
    }
  },
})

export default BackgroundHighlight
