import type { Transition } from 'framer-motion'

export const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

export const fadeUp = (delay = 0): Partial<{ initial: object; animate: object; transition: Transition }> => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE },
})

export const fadeIn = (delay = 0): Partial<{ initial: object; animate: object; transition: Transition }> => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5, delay, ease: EASE },
})

export const viewFadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay, ease: EASE } as Transition,
})
