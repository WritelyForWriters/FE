import { getCookie } from 'cookies-next/client'
import { atom } from 'jotai'

export const isLoggedInAtom = atom(!!getCookie('isLoggedIn'))
