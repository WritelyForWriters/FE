import { Mark, mergeAttributes } from '@tiptap/core'

export interface UnderlineHighlightOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    underlineHighlight: {
      setUnderlineHighlight: (attributes?: { color?: string; memoId?: string }) => ReturnType
      unsetUnderlineHighlight: () => ReturnType
    }
  }
}

// Tiptap Mark를 확장하여 밀줄 하이라이트 기능을 제공하는 Custom Extension
export const UnderlineHighlight = Mark.create<UnderlineHighlightOptions>({
  name: 'underlineHighlight',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      color: {
        default: '#FFC6C6',
      },
      memoId: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'mark[data-type="underline"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { color, memoId } = HTMLAttributes
    return [
      'mark',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-type': 'underline',
        'data-memo-id': memoId, // 메모 저장 후 생성된 메모ID를 mark태그 속성으로 저장
        class: 'underline-highlight',
        style: `border-bottom: 2px solid ${color}; background-color: transparent; padding-bottom: 5px;`,
      }),
      0,
    ]
  },

  addCommands() {
    return {
      setUnderlineHighlight:
        (attributes = {}) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes)
        },
      unsetUnderlineHighlight:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
    }
  },
})

export default UnderlineHighlight
