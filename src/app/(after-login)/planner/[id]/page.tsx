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

function usePlannerData(params: Params) {
  const { id } = use(params)
  const { data: templates } = useFetchProductTemplates(id)
  const characters = useAtomValue(plannerCharacterByIdAtom(id))

  return { id, templates, characters }
}

export default function PlannerPage({ params }: { params: Params }) {
  const { id, templates, characters } = usePlannerData(params)
  const [isSaved, setIsSaved] = useState(false)

  const methods = useForm<PlannerSynopsisFormValues>()
  const {
    setValue,
    formState: { isValid },
    handleSubmit,
  } = methods

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

      const values = PlannerSynopsisFormValues.from(templates)

      setValue('synopsis', values.synopsis)
      setValue('worldview', values.worldview)
      // NOTE(hajae): local storage에 저장된 캐릭터가 우선
      // https://www.notion.so/1678209b09f98067a6e7c8e3ef8b08ff?d=1cb8209b09f980e8bfb9001c4c150e72&pvs=4#1718209b09f980a6afbfd4244f71cb25
      setValue('characters', characters ?? values.characters)
      setValue('plot', values.plot)
      setValue('ideaNote', values.ideaNote)
    }
  }, [setValue, templates])

  const handleFormSubmit = handleSubmit((formValues) => {
    const request = PlannerTemplatesRequest.from(formValues, characters)

    createTemplate({
      productId: id,
      request,
    })
  })

  return (
    <div className={cx('container')}>
      <PlannerActionBar isValidFormValues={isValid} isSaved={isSaved} onSubmit={handleFormSubmit} />
      <div className={cx('main-section')}>
        <PlannerTabs />
        <FormProvider {...methods}>
          <PlannerSynopsisFormContainer />
        </FormProvider>
      </div>
    </div>
  )
}
