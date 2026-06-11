import { useRef, type ReactNode, type PointerEvent, type CSSProperties } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useIsCoarsePointer } from '../hooks/useMedia'

/**
 * Perspective tilt surface. Tracks the pointer and rotates in 3D,
 * exposing --gx / --gy CSS vars so children can paint a glare hotspot.
 */
export default function Tilt({
  children,
  max = 10,
  className,
  style,
}: {
  children: ReactNode
  max?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const coarse = useIsCoarsePointer()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 120, damping: 18 })
  const sy = useSpring(py, { stiffness: 120, damping: 18 })
  const rotateX = useTransform(sy, [0, 1], [max, -max])
  const rotateY = useTransform(sx, [0, 1], [-max, max])

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (coarse || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width
    const ny = (e.clientY - rect.top) / rect.height
    px.set(nx)
    py.set(ny)
    ref.current.style.setProperty('--gx', `${nx * 100}%`)
    ref.current.style.setProperty('--gy', `${ny * 100}%`)
  }

  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', ...style }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  )
}
