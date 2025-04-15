'use client'

import { use, useEffect, useState } from 'react'

import { useAtomValue } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { plannerCharacterByIdAtom } from 'store/plannerAtoms'
import { PlannerTemplatesRequest } from 'types/planner/plannerTemplatesRequest'

import { useCreateProductTemplates } from '@hooks/products/useProductsMutation'
import { useFetchProductTemplates } from '@hooks/products/useProductsQueries'

import { PlannerSynopsisFormValues } from '../../../types/planner/plannerSynopsisFormValues'
import PlannerActionBar from './_components/planner-action-bar/PlannerActionBar'
import PlannerSynopsisFormContainer from './_components/planner-synopsis-form-container/PlannerSynopsisFormContainer'
import PlannerTabs from './_components/planner-tabs/PlannerTabs'

import classNames from 'classnames/bind'

import styles from './page.module.scss'

const cx = classNames.bind(styles)

type Params = Promise<{ id: string }>

export default function PlannerPage(props: { params: Params }) {
  const params = use(props.params)
  const id = params.id

  const [isSaved, setIsSaved] = useState(false)
  const characters = useAtomValue(plannerCharacterByIdAtom(id))

  const methods = useForm<PlannerSynopsisFormValues>()
  const {
    formState: { isValid },
    handleSubmit,
  } = methods

  const { data: templates } = useFetchProductTemplates(id)
  const { mutate: createTemplate } = useCreateProductTemplates()

  useEffect(() => {
    if (templates) {
      // NOTE(hajae): fetch된 데이터가 하나라도 있으면 이미 저장된 상태로 간주
      setIsSaved(
        templates.characters.length > 0 ||
          templates.ideaNote !== null ||
          templates.plot !== null ||
          templates.synopsis !== null ||
          templates.worldview !== null,
      )

      console.log(templates)
    }
  }, [templates])

  /* TODO(hajae):
   * [x] type 작성
   * [x] api/ 작성
   * [x] useProductsQueries 작성
   * [x] Header - Data Fetch 후 저장된 데이터가 있으면 저장하기 버튼 없으면 수정하기
   * [ ] Form - Set Form Value
   */

  return (
    <div className={cx('container')}>
      <PlannerActionBar
        isValidFormValues={isValid}
        isSaved={isSaved}
        onSubmit={handleSubmit((formValues) => {
          const request = PlannerTemplatesRequest.from(formValues, characters)

          console.log('formValues: ', formValues)
          console.log('request: ', request)

          createTemplate({
            productId: id,
            request: request,
          })
        })}
      />
      <div className={cx('main-section')}>
        <PlannerTabs />
        <FormProvider {...methods}>
          <PlannerSynopsisFormContainer />
        </FormProvider>
      </div>
    </div>
  )
}
