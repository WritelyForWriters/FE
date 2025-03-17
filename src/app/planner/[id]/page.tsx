import { PLANNER_TABS, PlannerTabType } from 'constants/planner/plannerConstants'

import PlannerActionBar from './components/planner-action-bar/PlannerActionBar'
import PlannerSynopsisForm from './components/planner-synopsis-form/PlannerSynopsisForm'
import PlannerTab from './components/planner-tab/PlannerTab'

type Params = Promise<{ id: string }>
type SearchParams = Promise<{ tab?: string }>

export default async function PlannerPage(props: { params: Params; searchParams: SearchParams }) {
  // TODO(hajae): for data fetch
  // const id = (await props.params).id
  const tab = (await props.searchParams).tab || 'synopsis'
  const selectedTab: PlannerTabType =
    PLANNER_TABS.find((plannerTab) => plannerTab.value === tab) || PLANNER_TABS[0]

  return (
    <div>
      <PlannerActionBar />
      <PlannerTab selectedTab={selectedTab} />
      {selectedTab.value === 'synopsis' && <PlannerSynopsisForm />}
    </div>
  )
}
