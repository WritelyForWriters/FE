'use client'

import { PlannerSynopsisFormValue } from 'planner/[id]/types/PlannerSynopsisFormValue'

import FormWrapper from '@components/form-wrapper/FormWrapper'

import PlannerSynopsisForm from '../planner-synopsis-form/PlannerSynopsisForm'

import classNames from 'classnames/bind'

import styles from './PlannerSynopsisFormContainer.module.scss'

const cx = classNames.bind(styles)

export default function PlannerSynopsisFormContainer() {
  return (
    <div className={cx('synopsis-form-wrapper')}>
      <FormWrapper<PlannerSynopsisFormValue>
        onSubmit={async (data) => {
          console.log(data)
        }}
      >
        <PlannerSynopsisForm />
        <button type="submit">Submit</button>
      </FormWrapper>
    </div>
  )
}
