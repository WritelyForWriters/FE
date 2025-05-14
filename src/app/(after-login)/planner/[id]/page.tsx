'use client'

import { use, useEffect, useState } from 'react'

import { useAtom } from 'jotai'
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
  const [formValues, setFormValues] = useAtom(plannerCharacterByIdAtom(id))
  const showToast = useToast()
  const { autoSaveTimer } = useAutoSaveTimer(300000)

  return {
    id,
    templates,
    formValues,
    setFormValues,
    showToast,
    autoSaveTimer,
  }
}

export default function PlannerPage({ params }: { params: Params }) {
  const { id, templates, formValues, setFormValues, showToast, autoSaveTimer } =
    usePlannerData(params)
  const [isSaved, setIsSaved] = useState(false)

  const methods = useForm<PlannerSynopsisFormValues>()
  const {
    reset,
    getValues,
    formState: { isValid },
    handleSubmit,
  } = methods

  const { mutate: createTemplate, isSuccess } = useCreateProductTemplates()

  const handleFormSubmit = handleSubmit((formValues) => {
    const request = PlannerTemplatesRequest.from(formValues, formValues.characters)

    createTemplate({
      productId: id,
      request,
    })
  })

  useEffect(() => {
    if (templates) {
      // NOTE(hajae): fetch된 데이터가 하나라도 있으면 이미 저장된 상태로 간주
      setIsSaved(templates.isSaved)

      // NOTE(hajae): 서버에 저장된 ID가 존재하고, Local Storage에 저장된 ID가 없을 경우 ID를 SET
      // 현재 사양은 클라이언트에 저장된 데이터를 우선으로 Character를 SET
      if (
        templates.characters.length > 0 &&
        formValues.characters.length > 0 &&
        formValues.characters.some((c) => !c.id)
      ) {
        const updatedCharacters = formValues.characters.map((character, index) => ({
          ...character,
          id: templates.characters[index]?.id ?? '',
        }))

        setFormValues(updatedCharacters)

        reset({
          synopsis: templates.synopsis,
          worldview: templates.worldview,
          characters: updatedCharacters,
          plot: templates.plot,
          ideaNote: templates.ideaNote,
        })

        return
      }

      reset({
        synopsis: formValues.synopsis ?? templates.synopsis,
        worldview: formValues.worldview ?? templates.worldview,
        characters: formValues.characters ?? templates.characters,
        plot: formValues.plot ?? templates.plot,
        ideaNote: formValues.ideaNote ?? templates.ideaNote,
      })
    }
  }, [reset, templates])

  useEffect(() => {
    if (isSuccess) {
      showToast('success', '저장이 완료되었습니다.')
    }
  }, [isSuccess])

  useEffect(() => {
    if (autoSaveTimer === 0) {
      setFormValues(getValues())
    }
  }, [autoSaveTimer])

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
