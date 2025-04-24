import { PLANNER_SYNOPSIS_LENGTH } from 'constants/planner/plannerConstants'

import { PlannerTemplates, Synopsis } from './plannerTemplatesResponse'

export type PlannerSynopsisFormValues = {
  synopsis: SynopsisFormValues
  worldview: WorldViewFormValues
  characters: CharacterFormValues[]
  plot: PlotFormValues
  ideaNote: IdeaNoteFormValues
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
  id?: string
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

export type IdeaNoteFormValues = {
  title: string
  content: string
}

export const PlannerSynopsisFormValues = {
  from: (res: PlannerTemplates): PlannerSynopsisFormValues => {
    return {
      synopsis: PlannerSynopsisFormValues.toSynopsisFormValues(res.synopsis),
      worldview: PlannerSynopsisFormValues.toWorldViewFormValues(res.worldview),
      characters: PlannerSynopsisFormValues.toCharacterFormValues(res.characters),
      plot: PlannerSynopsisFormValues.toPlotFormValues(res.plot),
      ideaNote: PlannerSynopsisFormValues.toIdeaNoteFormValues(res.ideaNote),
    }
  },

  toSynopsisFormValues: (synopsis: Synopsis): SynopsisFormValues => {
    if (!synopsis) {
      return {
        genre: [],
        length: undefined,
        purpose: '',
        logline: '',
        example: '',
      }
    }

    const genres = synopsis.genre.split(', ')
    const length = PLANNER_SYNOPSIS_LENGTH.find((length) => length.value === synopsis.length)

    return {
      ...synopsis,
      genre: genres.map((genre) => {
        return { label: genre, value: genre }
      }),
      length: length,
    }
  },

  toWorldViewFormValues: (worldview: WorldViewFormValues): WorldViewFormValues => {
    if (!worldview) {
      return {
        geography: '',
        history: '',
        politics: '',
        society: '',
        religion: '',
        economy: '',
        technology: '',
        lifestyle: '',
        language: '',
        culture: '',
        species: '',
        occupation: '',
        conflict: '',
        customFields: [],
      }
    }

    return worldview
  },

  toCharacterFormValues: (characters: CharacterFormValues[]): CharacterFormValues[] => {
    if (!characters) {
      return []
    }

    return characters.map((character) => ({
      ...character,
      customFields: character.customFields || [],
    }))
  },

  toPlotFormValues: (plot: PlotFormValues): PlotFormValues => {
    if (!plot) {
      return {
        content: '',
      }
    }

    return plot
  },

  toIdeaNoteFormValues: (ideaNote: IdeaNoteFormValues): IdeaNoteFormValues => {
    if (!ideaNote) {
      return {
        title: '',
        content: '',
      }
    }

    return ideaNote
  },
}
