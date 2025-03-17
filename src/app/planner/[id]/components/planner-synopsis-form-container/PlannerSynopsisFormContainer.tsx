'use client'

import FormWrapper from '@components/form-wrapper/FormWrapper'

import PlannerSynopsisForm from '../planner-synopsis-form/PlannerSynopsisForm'

import classNames from 'classnames/bind'

import styles from './PlannerSynopsisFormContainer.module.scss'

const cx = classNames.bind(styles)

type PlannerSynopsisFormValue = {
  synopsis: SynopsisFormValues
  worldView: WorldViewFormValues
  character: CharacterFormValues[]
}

type SynopsisFormValues = {
  genre: string
  length: string
  purpose: string
  logline: string
  example: string
}

type WorldViewFormValues = {
  geography: string
  history: string
  politics: string
  society: string
  religion: string
  economy: string
  technology: string
  lifestyle: string
  language: string
  culture: string
  species: string
  occupation: string
  conflict: string
}

type CharacterFormValues = {
  intro: string
  name: string
  age: number
  gender: string
  occuption: string
  appearance: string
  personality: string
  characteristic: string
  relationship: string
}

export default function PlannerSynopsisFormContainer() {
  return (
    <div className={cx('synopsis-form-wrapper')}>
      <FormWrapper<PlannerSynopsisFormValue> onSubmit={async () => {}}>
        <PlannerSynopsisForm />
      </FormWrapper>
    </div>
  )
}
