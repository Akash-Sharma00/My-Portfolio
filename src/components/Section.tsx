import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

const rise = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export function SectionHead({
  kicker,
  title,
  sub,
}: {
  kicker: string
  title: ReactNode
  sub?: string
}) {
  return (
    <motion.div
      className="section-head"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
    >
      <motion.span className="kicker" variants={rise} custom={0}>
        {kicker}
      </motion.span>
      <motion.h2 className="section-title" variants={rise} custom={1}>
        {title}
      </motion.h2>
      {sub && (
        <motion.p className="section-sub" variants={rise} custom={2}>
          {sub}
        </motion.p>
      )}
    </motion.div>
  )
}

export { rise }
