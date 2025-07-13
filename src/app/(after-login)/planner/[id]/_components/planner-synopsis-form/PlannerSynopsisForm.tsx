import {
  PLANNER_SYNOPSIS_GENRES,
  PLANNER_SYNOPSIS_LENGTH,
} from 'constants/planner/plannerConstants'
import { useAtomValue } from 'jotai'
import { PlannerTemplatesModeAtom } from 'store/plannerModeAtoms'

import Dropdown from '@components/dropdown/Dropdown'
import TextField from '@components/text-field/TextField'

import PlannerFieldWithButton from '../planner-field-with-button/PlannerFieldWithButton'

import classNames from 'classnames/bind'

import styles from './PlannerSynopsisForm.module.scss'

const cx = classNames.bind(styles)
interface PlannerSynopsisFormProps {
  isPending: boolean
  handleManualModification: (
    name: string,
    section: string,
  ) => (value: string, inputValue: string) => Promise<boolean>
}

export default function PlannerSynopsisForm({
  isPending,
  handleManualModification,
}: PlannerSynopsisFormProps) {
  const mode = useAtomValue(PlannerTemplatesModeAtom)

  return (
    <div className={cx('synopsis-form')} id="heading1">
      <div className={cx('synopsis-form__title')}>시놉시스</div>
      <Dropdown
        name="synopsis.genre"
        type="outlined"
        placeholder="장르"
        label="장르"
        options={PLANNER_SYNOPSIS_GENRES}
        isRequired={false}
        isMulti={true}
        readOnly={mode === 'view'}
      />
      <PlannerFieldWithButton
        name="synopsis.length"
        itemName="분량"
        isDropdown={true}
        manualModifiable={false}
      >
        <Dropdown
          name="synopsis.length"
          type="outlined"
          placeholder="분량"
          label="분량"
          options={PLANNER_SYNOPSIS_LENGTH}
          isRequired={false}
          readOnly={mode === 'view'}
        />
      </PlannerFieldWithButton>

      <PlannerFieldWithButton name="synopsis.purpose" itemName="기획 의도" manualModifiable={false}>
        <TextField
          name="synopsis.purpose"
          label="기획 의도"
          variant="expand"
          readOnly={mode === 'view'}
        />
      </PlannerFieldWithButton>

      <TextField
        name="synopsis.logline"
        label="로그 라인"
        variant="expand"
        readOnly={mode === 'view'}
      />
      <PlannerFieldWithButton
        name="synopsis.example"
        itemName="예시 문장"
        handleManualModification={handleManualModification('synopsis.example', 'example')}
        isPending={isPending}
      >
        <TextField
          name="synopsis.example"
          label="예시 문장"
          variant="expand"
          readOnly={mode === 'view'}
        />
      </PlannerFieldWithButton>
    </div>
  )
}
