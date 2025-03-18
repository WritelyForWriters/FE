export type PlannerSynopsisFormValue = {
  synopsis: SynopsisFormValues
  worldView: WorldViewFormValues
  character: CharacterFormValues[]
}

type SynopsisFormValues = {
  genre: { label: string; value: string }
  length: { label: string; value: string }
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
