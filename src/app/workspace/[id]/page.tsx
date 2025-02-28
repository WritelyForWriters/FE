// 작업공간
import ActionBar from '@components/action-bar/ActionBar'

export default function Page() {
  return (
    <div style={{ height: '100vh' }}>
      <ActionBar usage="workspace" />
      <ActionBar usage="planner" />
    </div>
  )
}
