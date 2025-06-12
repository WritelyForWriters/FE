'use client'

import { use, useEffect } from 'react'

import { useAtom, useSetAtom } from 'jotai'
import { FormProvider, useForm } from 'react-hook-form'
import { plannerCharacterByIdAtom } from 'store/plannerAtoms'
import { PlannerTemplatesModeAtom } from 'store/plannerModeAtoms'
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
  const showToast = useToast()
  const { autoSaveTimer } = useAutoSaveTimer(300000)

  return {
    id,
    templates,
    showToast,
    autoSaveTimer,
  }
}

export default function PlannerPage({ params }: { params: Params }) {
  const { id, templates, showToast, autoSaveTimer } = usePlannerData(params)
  const [formValues, setFormValues] = useAtom(plannerCharacterByIdAtom(id))
  const setMode = useSetAtom(PlannerTemplatesModeAtom)

  const methods = useForm<PlannerSynopsisFormValues>()
  const {
    reset,
    getValues,
    formState: { isValid, isDirty },
    handleSubmit,
  } = methods

  const { mutate: createTemplate, isSuccess } = useCreateProductTemplates()

  const handleFormSubmit = handleSubmit((formValues) => {
    const request = PlannerTemplatesRequest.from(formValues, formValues.characters)

    createTemplate(
      {
        productId: id,
        request,
      },
      {
        onSuccess: () => {
          setMode('view')
          setFormValues(formValues, 'form')
        },
      },
    )
  })

  useEffect(() => {
    if (templates && formValues) {
      const inInitalized = formValues.isInitialized

      if (!inInitalized) {
        setFormValues(templates, 'form')
        reset({
          synopsis: templates.synopsis,
          worldview: templates.worldview,
          characters: templates.characters,
          plot: templates.plot,
          ideaNote: templates.ideaNote,
        })
      } else {
        // NOTE(hajae): fetch된 데이터가 하나라도 있으면 이미 저장된 상태로 간주
        setMode(templates.isSaved ? 'view' : 'edit')
        reset({
          synopsis: formValues.synopsis,
          worldview: formValues.worldview,
          characters: formValues.characters,
          plot: formValues.plot,
          ideaNote: formValues.ideaNote,
        })
      }
    }
  }, [templates])

  useEffect(() => {
    if (isSuccess) {
      showToast('success', '저장이 완료되었습니다.')
    }
  }, [isSuccess, showToast])

  useEffect(() => {
    if (autoSaveTimer === 0) {
      setFormValues(getValues(), 'form')
    }
  }, [autoSaveTimer])

  return (
    <div className={cx('container')}>
      <PlannerActionBar
        productId={id}
        isValidFormValues={isValid}
        isFormDirty={isDirty}
        onSubmit={handleFormSubmit}
        autoSaveTimer={autoSaveTimer}
        onResetForm={() => reset(getValues())}
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
