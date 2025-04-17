import { useRef } from 'react'

import { JSONContent } from '@tiptap/react'
import { useFormContext } from 'react-hook-form'
import { HandleEditor } from 'types/common/editor'

import PlannerIdeaNoteEditor from '@components/editor/planner-idea-note-editor/PlannerIdeaNoteEditor'

export default function PlannerIdeaNote() {
  const { watch, setValue } = useFormContext()
  const ideaNoteValue = watch('ideaNote.content')
  const editorRef = useRef<HandleEditor>(null)

  const handleUpdate = () => {
    if (!editorRef.current) return

    const json: JSONContent | undefined = editorRef.current.getEditor()?.getJSON()
    setValue('ideaNote.content', JSON.stringify(json))
  }

  return (
    <PlannerIdeaNoteEditor ref={editorRef} onUpdate={handleUpdate} contents={ideaNoteValue || ''} />
  )
}
