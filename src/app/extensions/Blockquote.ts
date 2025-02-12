import Blockquote from '@tiptap/extension-blockquote'

const BlockquoteExtension = Blockquote.extend({
  priority: 101,
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-B': ({ editor }) => editor.commands.toggleBlockquote(),
    }
  },
})

export default BlockquoteExtension
