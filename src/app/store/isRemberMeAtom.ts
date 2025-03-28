import { getCookie } from 'cookies-next'
import { atom } from 'jotai'

export const isRemberMeAtom = atom<boolean>(!!getCookie('isRemberMe'))
