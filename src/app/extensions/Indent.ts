import { CommandProps, Extension, GlobalAttributes } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    Indent: {
      indent: () => ReturnType
      outdent: () => ReturnType
    }
  }
}

type IndentOptions = {
  types: string[]
  indentLevels: number[]
  defaultIndentLevel: number
}

// Create an extension
const Indent = Extension.create<IndentOptions>({
  name: 'indent',
  addOptions: () => {
    return {
      types: ['paragraph'],
      indentLevels: [0, 30, 60, 90],
      defaultIndentLevel: 0,
    }
  },

  addGlobalAttributes: (): GlobalAttributes => {
    return [
      {
        types: Indent.options.types,
        attributes: {
          indent: {
            default: Indent.options.defaultIndentLevel,
            // --extension이 HTML에서 렌더링되는 방법을 설정
            renderHTML: (attributes) => {
              const indent = isNaN(attributes.indent) ? 0 : attributes.indent
              return {
                style: `margin-left: ${indent}px!important;`,
              }
            },
            // --HTML 속성을 가져와서 indent 적용
            parseHTML: (element) => ({
              indent: parseInt(element.style.marginLeft) || Indent.options.defaultIndentLevel,
            }),
          },
        },
      },
    ]
  },

  // --extension(들여쓰기, 내어쓰기) 기능 설정
  addCommands: () => {
    return {
      indent:
        () =>
        ({ commands, editor }: CommandProps) => {
          const indentLevels: number[] = Indent.options.indentLevels
          const indent = editor.getAttributes('paragraph').indent
          const currentIndent = isNaN(indent) ? 0 : indent
          const nextIndent =
            indentLevels.find((level: number) => level > currentIndent) || currentIndent
          return commands.updateAttributes('paragraph', { indent: nextIndent })
        },
      outdent:
        () =>
        ({ commands, editor }: CommandProps) => {
          const indentLevels: number[] = Indent.options.indentLevels
          const currentIndent = editor.getAttributes('paragraph').indent || 0
          const prevIndent = [...indentLevels].reverse().find((level) => level < currentIndent) || 0
          return commands.updateAttributes('paragraph', { indent: prevIndent })
        },
    }
  },

  // --키보드 단축키 설정
  addKeyboardShortcuts: () => {
    return {
      Tab: ({ editor }) => editor.commands.indent(),
      'Shift-Tab': ({ editor }) => editor.commands.outdent(),
    }
  },
})

export default Indent
