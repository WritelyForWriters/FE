'use client'

import FormWrapper from '@components/form-wrapper/FormWrapper'

import { PlannerSynopsisFormValue } from '../../types/plannerSynopsisFormValue'

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
      <button type="submit">Submit</button>
    </FormWrapper>
  )
}
