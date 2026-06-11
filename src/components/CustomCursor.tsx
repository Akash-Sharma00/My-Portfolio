import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Subtle two-layer cursor: a small solid dot that tracks exactly, and a larger
 * springy ring that lags slightly and grows over interactive elements.
 * Disabled on touch / coarse-pointer devices.
 */
export default function CustomCursor() {
  // Only enable for devices with a fine pointer (mouse/trackpad), decided once on mount
  const [enabled] = useState(() =>
    typeof window !== 'undefined' && !!window.matchMedia?.('(pointer: fine)').matches
  )
  const [hovering, setHovering] = useState(false)

  // Dot tracks instantly; ring follows with spring easing
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)
  const ringX = useSpring(dotX, { stiffness: 350, damping: 28, mass: 0.5 })
  const ringY = useSpring(dotY, { stiffness: 350, damping: 28, mass: 0.5 })

  useEffect(() => {
    if (!enabled) return

    const move = (e: MouseEvent) => {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
      const el = e.target as HTMLElement | null
      setHovering(!!el?.closest('a, button, [role="button"], input, textarea, [data-cursor="hover"]'))
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [enabled, dotX, dotY])

  if (!enabled) return null

  return (
    <>
      {/* Hide the native cursor only while the custom one is active */}
      <style>{`* { cursor: none !important; }`}</style>

      {/* Outer ring */}
      <motion.div
        aria-hidden
        animate={{
          width: hovering ? 46 : 30,
          height: hovering ? 46 : 30,
          borderColor: hovering ? 'var(--accent)' : 'var(--text-muted)',
          opacity: hovering ? 1 : 0.6,
        }}
        transition={{ duration: 0.18 }}
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none',
          x: ringX, y: ringY, translateX: '-50%', translateY: '-50%',
          borderRadius: '50%', border: '1.5px solid var(--text-muted)',
          mixBlendMode: 'difference',
        }}
      />

      {/* Inner dot */}
      <motion.div
        aria-hidden
        animate={{ scale: hovering ? 0 : 1 }}
        transition={{ duration: 0.18 }}
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none',
          x: dotX, y: dotY, translateX: '-50%', translateY: '-50%',
          width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
        }}
      />
    </>
  )
}
