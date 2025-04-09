'use client'

import { FormProvider, useForm } from 'react-hook-form'

import { PlannerSynopsisFormValues } from '../../../types/planner/plannerSynopsisFormValues'
import PlannerActionBar from './_components/planner-action-bar/PlannerActionBar'
import PlannerSynopsisFormContainer from './_components/planner-synopsis-form-container/PlannerSynopsisFormContainer'
import PlannerTabs from './_components/planner-tabs/PlannerTabs'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

export default function PlannerPage() {
  const methods = useForm<PlannerSynopsisFormValues>()
  const {
    formState: { isValid },
  } = methods

  /* TODO(hajae):
   * [x] type 작성
   * [ ] api/ 작성
   * [ ] services/ 작성 (parsing)
   * [ ] Header - Data Fetch 후 저장된 데이터가 있으면 저장하기 버튼 없으면 수정하기
   * [ ] Form - Set Form Value
   */

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
