import TextField from '@components/text-field/TextField'

import PlannerFieldWithButton from '../planner-field-with-button/PlannerFieldWithButton'

import classNames from 'classnames/bind'

import styles from './PlannerPlotForm.module.scss'

const cx = classNames.bind(styles)

export default function PlannerPlotForm() {
  return (
    <div className={cx('plot-form')} id="heading4">
      <div className={cx('plot-form__title')}>줄거리</div>
      <PlannerFieldWithButton name="plot.content">
        <TextField name="plot.content" label="발단-전개-위기-결말" variant="expand" />
      </PlannerFieldWithButton>
    </div>
  )
}
