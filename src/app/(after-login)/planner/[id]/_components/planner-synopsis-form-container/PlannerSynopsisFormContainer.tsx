'use client'

import PlannerCharacterForm from '../planner-character-form/PlannerCharacterForm'
import PlannerPlotForm from '../planner-plot-form/PlannerPlotForm'
import PlannerSynopsisForm from '../planner-synopsis-form/PlannerSynopsisForm'
import PlannerWorldViewForm from '../planner-world-view-form/PlannerWorldViewForm'

export default function PlannerSynopsisFormContainer() {
  return (
    <>
      <PlannerSynopsisForm />
      <PlannerWorldViewForm />
      <PlannerCharacterForm />
      <PlannerPlotForm />
      <button type="submit">Submit</button>
    </>
  )
}
