import { useRef } from 'react'

import { HandleEditor } from 'types/common/editor'

import PlannerIdeaNoteEditor from '@components/editor/planner-idea-note-editor/PlannerIdeaNoteEditor'

export default function PlannerIdeaNote() {
  const editorRef = useRef<HandleEditor>(null)

  return <PlannerIdeaNoteEditor ref={editorRef} />
}
