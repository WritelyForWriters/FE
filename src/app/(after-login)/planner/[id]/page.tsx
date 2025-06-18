'use client'

import { use, useEffect } from 'react'

import { NEW_PLANNER_CHARACTER } from 'constants/planner/plannerConstants'
import { useAtom, useSetAtom } from 'jotai'
import { trackEvent } from 'lib/amplitude'
import { FormProvider, useForm } from 'react-hook-form'
import { plannerCharacterByIdAtom } from 'store/plannerAtoms'
import { PlannerTemplatesModeAtom } from 'store/plannerModeAtoms'
import { PlannerTemplatesRequest } from 'types/planner/plannerTemplatesRequest'

import { useToast } from '@components/toast/ToastProvider'

import { useAutoSaveTimer } from '@hooks/products/useAutoSaveTimer'
import { useCreateProductTemplates } from '@hooks/products/useProductsMutation'
import { useFetchProductTemplates } from '@hooks/products/useProductsQueries'

import {
  CharacterFormValues,
  PlannerSynopsisFormValues,
} from '../../../types/planner/plannerSynopsisFormValues'
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

  const handleFormSubmit = handleSubmit((formData) => {
    const request = PlannerTemplatesRequest.from(formData, formValues.characters)

    createTemplate(
      {
        productId: id,
        request,
      },
      {
        onSuccess: () => {
          setMode('view')
          setFormValues(formData, 'form')
        },
      },
    )
  })

  useEffect(() => {
    if (templates && formValues) {
      // NOTE(hajae): fetch된 데이터가 하나라도 있으면 이미 저장된 상태로 간주
      setMode(templates.isSaved ? 'view' : 'edit')

      if (!formValues.isInitialized) {
        const newCharacters =
          templates.characters.length === 0 ? [NEW_PLANNER_CHARACTER] : templates.characters

        setFormValues({ ...templates, characters: newCharacters }, 'form')
        reset({
          synopsis: templates.synopsis,
          worldview: templates.worldview,
          characters: newCharacters,
          plot: templates.plot,
          ideaNote: templates.ideaNote,
        })
      } else {
        if (
          templates.characters.length > 0 &&
          formValues.characters.length > 0 &&
          formValues.characters.some((c) => !c.id)
        ) {
          const updatedCharacters: CharacterFormValues[] = formValues.characters.map(
            (character, index) => ({
              ...character,
              id: templates.characters[index]?.id ?? '',
            }),
          )
          setFormValues(updatedCharacters, 'character')

          reset({
            synopsis: formValues.synopsis,
            worldview: formValues.worldview,
            characters: updatedCharacters,
            plot: formValues.plot,
            ideaNote: formValues.ideaNote,
          })
        } else {
          reset({
            synopsis: formValues.synopsis,
            worldview: formValues.worldview,
            characters: formValues.characters,
            plot: formValues.plot,
            ideaNote: formValues.ideaNote,
          })
        }
      }
    }
  }, [templates])

  useEffect(() => {
    if (isSuccess) {
      showToast('success', '저장이 완료되었습니다.')
    }
  }, [isSuccess])

  useEffect(() => {
    if (autoSaveTimer === 0) {
      setFormValues(getValues(), 'form')
    }
  }, [autoSaveTimer])

  useEffect(() => {
    const enterTime = Date.now()

    trackEvent('page_view', {
      page_name: 'planner',
    })

    return () => {
      const exitTime = Date.now()
      const timeSpent = Math.floor((exitTime - enterTime) / 1000)

      trackEvent('page_exit', {
        page_name: 'planner',
        time_spent: timeSpent,
      })
    }
  }, [])

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
