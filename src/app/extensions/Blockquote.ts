import Blockquote from '@tiptap/extension-blockquote'

const BlockquoteExtension = Blockquote.extend({
  priority: 101, // 단축키 우선순위 (default: 100)
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-B': ({ editor }) => editor.commands.toggleBlockquote(), // 키보드 단축키 설정 (Mod: Control or Mac Cmd shorthand)
    }
  },
})

export default BlockquoteExtension
