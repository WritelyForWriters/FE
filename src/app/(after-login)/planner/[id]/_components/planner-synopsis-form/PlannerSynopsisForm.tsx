import {
  PLANNER_SYNOPSIS_GENRES,
  PLANNER_SYNOPSIS_LENGTH,
} from 'constants/planner/plannerConstants'

import Dropdown from '@components/dropdown/Dropdown'
import TextField from '@components/text-field/TextField'

import PlannerFieldWithButton from '../planner-field-with-button/PlannerFieldWithButton'

import classNames from 'classnames/bind'

import styles from './PlannerSynopsisForm.module.scss'

const cx = classNames.bind(styles)

export default function PlannerSynopsisForm() {
  return (
    <div className={cx('synopsis-form')} id="heading1">
      <div className={cx('synopsis-form__title')}>시놉시스</div>
      <Dropdown
        name="synopsis.genre"
        type="outlined"
        placeholder="장르"
        label="장르"
        options={PLANNER_SYNOPSIS_GENRES}
        rules={{
          required: {
            value: true,
            message: '필수 입력 사항입니다.',
          },
        }}
        isMulti={true}
        isRequired={true}
      />
      <Dropdown
        name="synopsis.length"
        type="outlined"
        placeholder="분량"
        label="분량"
        options={PLANNER_SYNOPSIS_LENGTH}
        isRequired={false}
      />

      <PlannerFieldWithButton name="synopsis.purpose" hasHelperText={false}>
        <TextField name="synopsis.purpose" label="기획 의도" variant="expand" />
      </PlannerFieldWithButton>

      <TextField
        name="synopsis.logline"
        label="로그 라인"
        variant="expand"
        options={{ required: { value: true, message: 'required' } }}
      />
      <PlannerFieldWithButton name="synopsis.example" hasHelperText={false}>
        <TextField name="synopsis.example" label="예시 문장" variant="expand" />
      </PlannerFieldWithButton>
    </div>
  )
}
