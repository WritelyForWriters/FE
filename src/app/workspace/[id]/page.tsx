// 작업공간
import ActionBar from './components/ActionBar/ActionBar'
import MemoPanel from './components/MemoPanel/MemoPanel'
import MemoPannel from './components/memo-pannel/MemoPannel'
import PlannerPannel from './components/planner-pannel/PlannerPannel'

export default function Page() {
  return (
    <>
      <ActionBar />
      <MemoPanel />
      <MemoPannel />
      <PlannerPannel />
    </>
  )
}
