export type PlannerSynopsisFormValue = {
  synopsis: SynopsisFormValues
  worldView: WorldViewFormValues
  character: CharacterFormValues[]
}

export type SynopsisFormValues = {
  genre: { label: string; value: string }
  length: { label: string; value: string }
  purpose: string
  logline: string
  example: string
}

export type WorldViewFormValues = {
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

export type CharacterFormValues = {
  // NOTE(hajae): 배열이기 때문에 추후 수정이 있다면 id가 필요하므로 추가
  characterId: string
  intro: string
  name: string
  age: number
  gender: string
  occupation: string
  appearance: string
  personality: string
  characteristic?: string
  relationship: string
}
