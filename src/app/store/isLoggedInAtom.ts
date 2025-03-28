import { getCookie } from 'cookies-next'
import { atom } from 'jotai'

export const isLoggedInAtom = atom<null | boolean>(!!getCookie('isLoggedIn'))
