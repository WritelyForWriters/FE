type CustomField = {
  id: string
  name: string
  content: string
}

export type Character = {
  id: string
  intro: string
  name: string
  age?: number
  gender: string
  occupation: string
  appearance: string
  personality: string
  characteristic: string
  relationship: string
  customFields: CustomField[]
}

type IdeaNote = {
  title: string
  content: string
}

type Plot = {
  content: string
}

type Synopsis = {
  genre: string
  length: string
  purpose: string
  logline: string
  example: string
}

type Worldview = {
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
  customFields: CustomField[]
}

export type PlannerTemplatesResponse = {
  id: string
  characters: Character[]
  ideaNote: IdeaNote
  plot: Plot
  synopsis: Synopsis
  worldview: Worldview
}
