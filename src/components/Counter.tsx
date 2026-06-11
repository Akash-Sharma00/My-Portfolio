import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface Props {
  /** Raw display value, e.g. "3.9+", "1.5L", "15+", "120" */
  value: string
  duration?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * Splits a display value into an optional leading prefix, the animatable
 * number, and a trailing suffix. e.g. "1.5L" -> { num: 1.5, decimals: 1, suffix: "L" }
 */
function parse(value: string) {
  const match = value.match(/^(\D*?)(\d+(?:\.\d+)?)(.*)$/)
  if (!match) return { prefix: '', num: null as number | null, decimals: 0, suffix: value }
  const [, prefix, numStr, suffix] = match
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0
  return { prefix, num: parseFloat(numStr), decimals, suffix }
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function Counter({ value, duration = 1400, style, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const { prefix, num, decimals, suffix } = parse(value)
  // When animation is off (no number, or reduced-motion) we render the final value immediately.
  const [display, setDisplay] = useState(() =>
    num === null || prefersReducedMotion()
      ? value
      : `${prefix}0${decimals ? '.' + '0'.repeat(decimals) : ''}${suffix}`
  )

  useEffect(() => {
    if (!inView || num === null || prefersReducedMotion()) return

    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      // easeOutExpo for a snappy, premium feel
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      const current = (num * eased).toFixed(decimals)
      setDisplay(`${prefix}${current}${suffix}`)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, num, decimals, prefix, suffix, value, duration])

  return <span ref={ref} className={className} style={style}>{display}</span>
}
