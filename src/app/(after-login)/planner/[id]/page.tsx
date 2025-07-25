'use client'

import { use, useCallback, useEffect, useState } from 'react'

import { NEW_PLANNER_CHARACTER } from 'constants/planner/plannerConstants'
import { PLANNER_TUTORIAL_STEPS } from 'constants/tutorial/steps'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { trackEvent } from 'lib/amplitude'
import { FormProvider, useForm } from 'react-hook-form'
import { CallBackProps, STATUS } from 'react-joyride'
import { hasProductAtom } from 'store/hasProductAtom'
import { isTutorialRunningAtom } from 'store/isTutorialRunningAtom'
import { plannerCharacterByIdAtom } from 'store/plannerAtoms'
import { PlannerTemplatesModeAtom } from 'store/plannerModeAtoms'
import { PlannerTemplatesRequest } from 'types/planner/plannerTemplatesRequest'

import ProductTour from '@components/product-tour/ProductTour'
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
  const [stepIndex, setStepIndex] = useState(0)
  const [isTutorialRunning, setIsTutorialRunning] = useAtom(isTutorialRunningAtom)

  const { id, templates, showToast, autoSaveTimer } = usePlannerData(params)
  const [formValues, setFormValues] = useAtom(plannerCharacterByIdAtom(id))
  const setMode = useSetAtom(PlannerTemplatesModeAtom)
  const hasProduct = useAtomValue(hasProductAtom)

  const methods = useForm<PlannerSynopsisFormValues>()
  const {
    reset,
    getValues,
    formState: { isDirty },
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsTutorialRunning(false)
      }

      setStepIndex((prev) => prev + 1)
    }

    if (isTutorialRunning) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isTutorialRunning])

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status, index, type } = data

    if (status === STATUS.FINISHED || status === STATUS.PAUSED) {
      setIsTutorialRunning(false)
    }

    if (type === 'step:after') {
      setStepIndex(index + 1)
    }
  }, [])

  return (
    <>
      {!hasProduct && (
        <ProductTour
          run={isTutorialRunning}
          callback={handleJoyrideCallback}
          stepIndex={stepIndex}
          steps={PLANNER_TUTORIAL_STEPS}
        />
      )}
      <div className={cx('container')}>
        <PlannerActionBar
          productId={id}
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
    </>
  )
}
