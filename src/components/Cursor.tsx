import { useEffect, useRef, useState } from 'react'
import { useIsCoarsePointer, usePrefersReducedMotion } from '../hooks/useMedia'

/**
 * Custom cursor: a snappy dot plus a lagging ring.
 * Ring expands over [data-cursor="link"] targets and becomes a
 * "VIEW" lens over [data-cursor="view"] targets.
 */
export default function Cursor() {
  const coarse = useIsCoarsePointer()
  const reduced = usePrefersReducedMotion()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<'default' | 'link' | 'view'>('default')

  useEffect(() => {
    if (coarse || reduced) return
    document.body.classList.add('has-cursor')

    const pos = { x: innerWidth / 2, y: innerHeight / 2 }
    const ring = { x: pos.x, y: pos.y }
    let raf = 0
    let visible = false

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (!visible) {
        ring.x = pos.x
        ring.y = pos.y
        visible = true
      }
      const target = (e.target as HTMLElement).closest('[data-cursor]')
      setMode((target?.getAttribute('data-cursor') as 'link' | 'view') || 'default')
    }

    const tick = () => {
      ring.x += (pos.x - ring.x) * 0.16
      ring.y += (pos.y - ring.y) * 0.16
      if (dotRef.current) dotRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [coarse, reduced])

  if (coarse || reduced) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div
        ref={ringRef}
        className={`cursor-ring${mode === 'link' ? ' is-link' : ''}${mode === 'view' ? ' is-view' : ''}`}
      >
        {mode === 'view' ? 'VIEW' : ''}
      </div>
    </>
  )
}
