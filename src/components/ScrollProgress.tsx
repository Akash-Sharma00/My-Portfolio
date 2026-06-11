import { motion, useScroll, useSpring } from 'framer-motion'

/** Thin accent bar pinned to the top of the page that tracks scroll progress. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 })

  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 2.5,
        transformOrigin: '0%', scaleX, zIndex: 200,
        background: 'linear-gradient(90deg, var(--accent), var(--purple))',
        boxShadow: '0 0 12px var(--accent-glow)',
      }}
    />
  )
}
