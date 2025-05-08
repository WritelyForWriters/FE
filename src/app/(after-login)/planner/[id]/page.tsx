'use client'

import { use, useEffect, useState } from 'react'

import { useAtomValue } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { plannerCharacterByIdAtom } from 'store/plannerAtoms'
import { PlannerTemplatesRequest } from 'types/planner/plannerTemplatesRequest'

import { useToast } from '@components/toast/ToastProvider'

import { useAutoSaveTimer } from '@hooks/products/useAutoSaveTimer'
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

function usePlannerData(params: Params) {
  const { id } = use(params)
  const { data: templates } = useFetchProductTemplates(id)
  const formValues = useAtomValue(plannerCharacterByIdAtom(id))
  const showToast = useToast()
  const { autoSaveTimer } = useAutoSaveTimer()

  return { id, templates, characters: formValues.characters, showToast, autoSaveTimer }
}

export default function PlannerPage({ params }: { params: Params }) {
  const { id, templates, characters, showToast, autoSaveTimer } = usePlannerData(params)
  const [isSaved, setIsSaved] = useState(false)

  const methods = useForm<PlannerSynopsisFormValues>()
  const {
    reset,
    formState: { isValid },
    handleSubmit,
  } = methods

  const { mutate: createTemplate, isSuccess } = useCreateProductTemplates()

  const handleFormSubmit = handleSubmit((formValues) => {
    const request = PlannerTemplatesRequest.from(formValues, characters)

    createTemplate({
      productId: id,
      request,
    })
  })

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

      reset({
        synopsis: templates.synopsis,
        worldview: templates.worldview,
        characters: characters ?? templates.characters,
        plot: templates.plot,
        ideaNote: templates.ideaNote,
      })
    }
  }, [reset, templates])

  useEffect(() => {
    if (isSuccess) {
      showToast('success', '저장이 완료되었습니다.')
    }
  }, [isSuccess])

  return (
    <div className={cx('container')}>
      <PlannerActionBar
        productId={id}
        isValidFormValues={isValid}
        isSaved={isSaved}
        onSubmit={handleFormSubmit}
        autoSaveTimer={autoSaveTimer}
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
