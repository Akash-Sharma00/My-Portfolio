import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import type { Education, Personal } from '../types'
import { SectionHead } from '../components/Section'

/** "3.9+" → { target: 3.9, rest: '+', decimals: 1 } · "1.5L" → { target: 1.5, rest: 'L' } */
function parseStat(value: string) {
  const m = value.match(/^([\d.]+)(.*)$/)
  if (!m) return { target: 0, rest: value, decimals: 0 }
  const num = m[1]
  return {
    target: parseFloat(num),
    rest: m[2],
    decimals: num.includes('.') ? num.split('.')[1].length : 0,
  }
}

function HoloCounter({ value, label, suffix, index }: { value: string; label: string; suffix: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { target, rest, decimals } = parseStat(value)
  const mv = useMotionValue(0)
  const text = useTransform(mv, (v) => v.toFixed(decimals))

  useEffect(() => {
    if (!inView) return
    const controls = animate(mv, target, { duration: 2, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] })
    return controls.stop
  }, [inView, target, index, mv])

  return (
    <motion.div
      ref={ref}
      className="dash-cell glass scanlines holo-border"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="dc-scan" />
      <span className="dc-ring" />
      <div className="dc-label">{label}</div>
      <div className="dc-value">
        <motion.span className="text-aurora">{text}</motion.span>
        <span className="text-aurora">{rest}</span>
        {suffix && <span className="dc-suffix">{suffix}</span>}
      </div>
    </motion.div>
  )
}

export default function Achievements({ personal, education }: { personal: Personal; education: Education }) {
  return (
    <section id="impact" className="section">
      <SectionHead
        kicker="04 · Mission Telemetry"
        title={
          <>
            Numbers from <span className="text-aurora">the field.</span>
          </>
        }
        sub={personal.about}
      />

      <div className="dash-grid">
        {personal.stats.map((s, i) => (
          <HoloCounter key={s.label} value={s.value} label={s.label} suffix={s.suffix} index={i} />
        ))}
      </div>

      <motion.div
        className="edu-strip glass"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="deg">{education.degree}</span>
        <span>{education.college}</span>
        <span className="mono" style={{ fontSize: 12 }}>
          {education.period}
        </span>
        <span className="gpa">◈ {education.cgpa}</span>
      </motion.div>
    </section>
  )
}
