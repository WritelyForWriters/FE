import TextField from '@components/text-field/TextField'

import classNames from 'classnames/bind'

import styles from './PlannerPlotForm.module.scss'

const cx = classNames.bind(styles)

export default function PlannerPlotForm() {
  return (
    <div className={cx('plot-form')} id="heading4">
      <div className={cx('plot-form__title')}>줄거리</div>
      <TextField name="plot.content" label="발단-전개-위기-결말" />
    </div>
  )
}
