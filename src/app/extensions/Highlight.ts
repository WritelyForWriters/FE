import { Mark, mergeAttributes } from '@tiptap/core'

// Tiptap Mark를 확장하여 밑줄 또는 배경색 하이라이트 기능을 제공하는 Custom Extension
export interface CustomHighlightOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customHighlight: {
      setCustomHighlight: (attributes?: {
        color?: string
        type?: 'background' | 'underline'
      }) => ReturnType
      unsetCustomHighlight: () => ReturnType
    }
  }
}

const CustomHighlight = Mark.create<CustomHighlightOptions>({
  name: 'customHighlight',

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
      type: {
        default: 'background',
      },
    }
  },

  // HTML > JSON으로 파싱할 때
  parseHTML() {
    return [{ tag: 'mark' }, { tag: 'mark[data-type="underline"]' }]
  },

  // JSON > HTML 렌더링할 때
  renderHTML({ HTMLAttributes }) {
    const { type, color } = HTMLAttributes

    if (type === 'underline') {
      return [
        'mark',
        mergeAttributes(this.options.HTMLAttributes, {
          'data-type': 'underline',
          class: 'underline-highlight',
          style: `border-bottom: 2px solid ${color}; background-color: transparent; padding-bottom: 5px;`,
        }),
        0,
      ]
    }

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
      setCustomHighlight:
        (attributes = {}) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes)
        },
      unsetCustomHighlight:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
    }
  },
})

export default CustomHighlight
