import PlannerActionBar from './components/planner-action-bar/PlannerActionBar'
import PlannerTab from './components/planner-tab/PlannerTab'

type Params = Promise<{ id: string }>
type SearchParams = Promise<{ tab?: string }>

export default async function PlannerPage(props: { params: Params; searchParams: SearchParams }) {
  // TODO(hajae): for data fetch
  // const id = (await props.params).id
  const tab = (await props.searchParams).tab || 'synopsys'

  return (
    <div>
      <PlannerActionBar />
      <PlannerTab tab={tab} />
    </div>
  )
}
