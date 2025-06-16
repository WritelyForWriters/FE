import { getCookie } from 'cookies-next/client'
import { atom } from 'jotai'

export const isRememberMeAtom = atom<boolean>(!!getCookie('isRememberMe'))
