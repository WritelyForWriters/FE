import { PLANNER_CHARACTER_ITEMS } from 'constants/planner/plannerConstants'

import FillButton from '@components/buttons/FillButton'
import TextField from '@components/text-field/TextField'

import classNames from 'classnames/bind'

import styles from './PlannerCharacterForm.module.scss'

const cx = classNames.bind(styles)

export default function PlannerCharacterForm() {
  return (
    <div className={cx('character-form')}>
      <div className={cx('character-form__title')}>
        <span>등장 인물</span>
        <FillButton size="small" variant="secondary">
          추가하기
        </FillButton>
      </div>

      {PLANNER_CHARACTER_ITEMS.map((item) => (
        <TextField key={item.itemId} name={item.name} label={item.label} />
      ))}
    </div>
  )
}
