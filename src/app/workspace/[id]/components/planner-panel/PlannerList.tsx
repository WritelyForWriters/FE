import PlannerItem from './PlannerItem'

import classNames from 'classnames/bind'

import styles from './PlannerList.module.scss'

const cx = classNames.bind(styles)

export default function PlannerList() {
  return (
    <ul className={cx('planner-list')}>
      <li>
        <PlannerItem title="시놉시스" content="시놉시스 내용" />
      </li>
      <li>
        <PlannerItem title="세계관" content="세계관 내용" />
      </li>
      <li>
        <PlannerItem title="등장인물" content="등장인물 내용" />
      </li>
      <li>
        <PlannerItem title="줄거리" content="줄거리 내용" />
      </li>
    </ul>
  )
}
