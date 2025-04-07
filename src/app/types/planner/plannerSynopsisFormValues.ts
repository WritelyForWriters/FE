export type PlannerSynopsisFormValues = {
  synopsis: SynopsisFormValues
  worldView: WorldViewFormValues
  character: CharacterFormValues[]
  plot: PlotFormValues
}

export type SynopsisFormValues = {
  genre: { label: string; value: string }[]
  length?: { label: string; value: string }
  purpose?: string
  logline: string
  example?: string
}

export type WorldViewFormValues = {
  geography?: string
  history?: string
  politics?: string
  society?: string
  religion?: string
  economy?: string
  technology?: string
  lifestyle?: string
  language?: string
  culture?: string
  species?: string
  occupation?: string
  conflict?: string
  customFields?: CustomField[]
}

export type CharacterFormValues = {
  intro?: string
  name?: string
  age?: number
  gender?: string
  occupation?: string
  appearance?: string
  personality?: string
  characteristic?: string
  relationship?: string
  customFields?: CustomField[]
}

export type PlotFormValues = {
  content?: string
}

export type CustomField = { id: string; name: string; content: string }
