import { PLANNER_WORLD_VIEW_ITEMS } from 'constants/planner/plannerConstants'

import TextField from '@components/text-field/TextField'

import classNames from 'classnames/bind'

import styles from './PlannerWorldViewForm.module.scss'

const cx = classNames.bind(styles)

export default function PlannerWorldViewForm() {
  return (
    <div className={cx('world-view-form')}>
      <div className={cx('world-view-form__title')}>세계관</div>
      {PLANNER_WORLD_VIEW_ITEMS.map((item) => (
        <TextField
          key={item.itemId}
          name={item.name}
          label={item.label}
          helperText={item.helperText}
        />
      ))}
    </div>
  )
}
