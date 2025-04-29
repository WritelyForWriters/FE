import { CharacterFormValues, PlannerSynopsisFormValues } from './plannerSynopsisFormValues'
import { PlannerTemplatesResponse } from './plannerTemplatesResponse'

export type PlannerTemplatesRequest = Omit<PlannerTemplatesResponse['result'], 'id'>

export const PlannerTemplatesRequest = {
  from: (
    formValues: PlannerSynopsisFormValues,
    characters: CharacterFormValues[],
  ): PlannerTemplatesRequest => {
    return {
      // NOTE(hajae): 값이 존재하지 않으면 '', 삭제한 항목이면 undefined로 삭제 유무를 구분한다.
      synopsis: {
        genre: formValues.synopsis.genre.map((genre) => genre.value).join(', '),
        length: formValues.synopsis.length?.value || '',
        purpose: formValues.synopsis.purpose,
        logline: formValues.synopsis.logline,
        example: formValues.synopsis.example,
      },
      worldview: {
        geography: formValues.worldview.geography,
        history: formValues.worldview.history,
        politics: formValues.worldview.politics,
        society: formValues.worldview.society,
        religion: formValues.worldview.religion,
        economy: formValues.worldview.economy,
        technology: formValues.worldview.technology,
        lifestyle: formValues.worldview.lifestyle,
        language: formValues.worldview.language,
        culture: formValues.worldview.culture,
        species: formValues.worldview.species,
        occupation: formValues.worldview.occupation,
        conflict: formValues.worldview.conflict,
        customFields: formValues.worldview.customFields
          ? Object.values(formValues.worldview.customFields).map((field) => ({
              id: field.id || undefined,
              name: field.name || '',
              content: field.content || '',
            }))
          : [],
      },
      characters: characters.map((character) => ({
        id: character.id,
        intro: character.intro,
        name: character.name || '',
        age: Number(character.age),
        gender: character.gender,
        occupation: character.occupation,
        appearance: character.appearance,
        personality: character.personality,
        relationship: character.relationship,
        customFields: character.customFields
          ? character.customFields.map((field) => ({
              id: field.id || undefined,
              name: field.name || '',
              content: field.content || '',
            }))
          : [],
      })),
      plot: {
        content: formValues.plot.content,
      },
      ideaNote: {
        title: formValues.ideaNote.title || '',
        content: formValues.ideaNote.content || '',
      },
    }
  },
}
