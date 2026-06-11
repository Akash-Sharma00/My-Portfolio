import { createContext, useContext } from 'react'
import type Lenis from 'lenis'

export type LenisRef = { current: Lenis | null }

export const LenisContext = createContext<LenisRef>({ current: null })

export function useLenis() {
  return useContext(LenisContext)
}

export function scrollToSection(lenis: Lenis | null, target: string) {
  if (lenis) {
    lenis.scrollTo(target, { offset: -90, duration: 1.6 })
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }
}
