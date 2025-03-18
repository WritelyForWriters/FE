import { PLANNER_TABS } from 'constants/planner/plannerConstants'

import PlannerActionBar from './components/planner-action-bar/PlannerActionBar'
import PlannerSynopsisFormContainer from './components/planner-synopsis-form-container/PlannerSynopsisFormContainer'
import PlannerTab from './components/planner-tab/PlannerTab'
import { PlannerTabType } from './types/PlannerTab'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

type Params = Promise<{ id: string }>
type SearchParams = Promise<{ tab?: string }>

export default async function PlannerPage(props: { params: Params; searchParams: SearchParams }) {
  // TODO(hajae): for data fetch
  // const id = (await props.params).id
  const tab = (await props.searchParams).tab || 'synopsis'
  const selectedTab: PlannerTabType =
    PLANNER_TABS.find((plannerTab) => plannerTab.value === tab) || PLANNER_TABS[0]

  return (
    <>
      <PlannerActionBar />
      <PlannerTab selectedTab={selectedTab} />
      <div className={cx('planner-body')}>
        {selectedTab.value === 'synopsis' && <PlannerSynopsisFormContainer />}
      </div>
    </>
  )
}
