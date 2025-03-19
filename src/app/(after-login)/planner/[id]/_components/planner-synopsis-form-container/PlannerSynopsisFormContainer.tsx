'use client'

import FormWrapper from '@components/form-wrapper/FormWrapper'

import { PlannerSynopsisFormValue } from '../../types/plannerSynopsisFormValue'
import PlannerSynopsisForm from '../planner-synopsis-form/PlannerSynopsisForm'
import PlannerWorldViewForm from '../planner-world-view-form/PlannerWorldViewForm'

import classNames from 'classnames/bind'

import styles from './PlannerSynopsisFormContainer.module.scss'

const cx = classNames.bind(styles)

export default function PlannerSynopsisFormContainer() {
  return (
    <FormWrapper<PlannerSynopsisFormValue>
      className={cx('form')}
      onSubmit={async (data) => {
        console.log(data)
      }}
    >
      <PlannerSynopsisForm />
      <PlannerWorldViewForm />
      <button type="submit">Submit</button>
    </FormWrapper>
  )
}
