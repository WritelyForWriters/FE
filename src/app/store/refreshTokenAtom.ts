import { atom } from 'jotai'

// TODO: API 수정되면 삭제 예정
export const refreshTokenAtom = atom<null | string>(null)
