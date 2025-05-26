import TextField from '@components/text-field/TextField'

import PlannerFieldWithButton from '../planner-field-with-button/PlannerFieldWithButton'

import classNames from 'classnames/bind'

import styles from './PlannerPlotForm.module.scss'

const cx = classNames.bind(styles)

interface PlannerPlotFormProps {
  handleManualModification: (
    name: string,
  ) => (value: string, inputValue: string) => Promise<boolean>
}

export default function PlannerPlotForm({ handleManualModification }: PlannerPlotFormProps) {
  return (
    <div className={cx('plot-form')} id="heading4">
      <div className={cx('plot-form__title')}>줄거리</div>
      <PlannerFieldWithButton
        name="plot.content"
        handleManualModification={handleManualModification('plot.content')}
      >
        <TextField name="plot.content" label="발단-전개-위기-결말" variant="expand" />
      </PlannerFieldWithButton>
    </div>
  )
}
