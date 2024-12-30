import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export const UniqueID = Extension.create({
  name: 'uniqueID',

  addGlobalAttributes() {
    return [
      {
        types: ['heading'],
        attributes: {
          id: {
            default: null,
            parseHTML: element => element.getAttribute('id'),
            renderHTML: attributes => {
              const id = attributes.id || `heading-${Math.random().toString(36).substr(2, 9)}`;
              return { id };
            },
          },
        },
      },
    ]
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('uniqueID'),
        appendTransaction: (transactions, oldState, newState) => {
          const docChanged = transactions.some(tr => tr.docChanged)
          const headingWithoutId = newState.doc.descendants((node, pos) => {
            if (node.type.name === 'heading' && !node.attrs.id) {
              return true
            }
          })

          if (docChanged && headingWithoutId) {
            const tr = newState.tr
            newState.doc.descendants((node, pos) => {
              if (node.type.name === 'heading' && !node.attrs.id) {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  id: `heading-${Math.random().toString(36).substr(2, 9)}`,
                })
              }
            })
            return tr
          }
        },
      }),
    ]
  },
}) 