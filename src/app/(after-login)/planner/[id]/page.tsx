'use client'

import { FormProvider, useForm } from 'react-hook-form'

import PlannerActionBar from './_components/planner-action-bar/PlannerActionBar'
import PlannerSynopsisFormContainer from './_components/planner-synopsis-form-container/PlannerSynopsisFormContainer'
import PlannerTabs from './_components/planner-tabs/PlannerTabs'
import { PlannerSynopsisFormValues } from './types/plannerSynopsisFormValues'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

export default function PlannerPage() {
  const methods = useForm<PlannerSynopsisFormValues>()
  const {
    formState: { isValid },
  } = methods

  return (
    <div className={cx('container')}>
      <PlannerActionBar isValidFormValues={isValid} />
      <div className={cx('main-section')}>
        <PlannerTabs />
        <FormProvider {...methods}>
          <PlannerSynopsisFormContainer />
        </FormProvider>
      </div>
    </div>
  )
}
