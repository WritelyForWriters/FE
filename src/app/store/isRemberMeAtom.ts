import { getCookie } from 'cookies-next/client'
import { atom } from 'jotai'

export const isRemberMeAtom = atom<boolean>(!!getCookie('isRemberMe'))
