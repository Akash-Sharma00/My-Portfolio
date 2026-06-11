import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import type { Education, Personal, WorkExperience } from '../types'
import { SectionHead } from '../components/Section'

const EASE = [0.16, 1, 0.3, 1] as const

interface Milestone {
  period: string
  company: string
  role: string
  body: string
  chips: string[]
  accent: string
  url?: string
  client?: { name: string; url?: string }
}

function JourneyItem({ m, index }: { m: Milestone; index: number }) {
  const fromLeft = index % 2 === 0
  return (
    <div className="journey-item" style={{ ['--accent' as string]: m.accent }}>
      <motion.span
        className="journey-node"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-120px' }}
        transition={{ duration: 0.5, ease: EASE }}
        // x/y must live in the motion transform — a CSS translate would be
        // overwritten by the scale animation, knocking the dot off the spine
        style={{ x: '-50%', y: '-50%', borderColor: m.accent, boxShadow: `0 0 0 6px ${m.accent}1f, 0 0 22px ${m.accent}` }}
      />
      <motion.div
        className="journey-when"
        initial={{ opacity: 0, x: fromLeft ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <div className="period" style={{ color: m.accent }}>
          {m.period}
        </div>
        {m.url ? (
          <a
            className="company company-link"
            href={m.url}
            target="_blank"
            rel="noreferrer"
            data-cursor="link"
          >
            {m.company}
            <span className="ext">↗</span>
          </a>
        ) : (
          <div className="company">{m.company}</div>
        )}
        <div className="role">{m.role}</div>
        {m.client &&
          (m.client.url ? (
            <a
              className="client-link"
              href={m.client.url}
              target="_blank"
              rel="noreferrer"
              data-cursor="link"
            >
              for {m.client.name} ↗
            </a>
          ) : (
            <span className="client-link">for {m.client.name}</span>
          ))}
      </motion.div>
      <motion.div
        className="journey-card glass holo-border"
        initial={{ opacity: 0, x: fromLeft ? 50 : -50, rotateY: fromLeft ? -10 : 10 }}
        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
        style={{ transformPerspective: 1000 }}
      >
        <p>{m.body}</p>
        {m.chips.length > 0 && (
          <div className="projects-mini">
            {m.chips.map((c) => (
              <span key={c} className="chip">
                {c}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function About({
  personal,
  workExperience,
  education,
}: {
  personal: Personal
  workExperience: WorkExperience[]
  education: Education
}) {
  const spineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: spineRef,
    offset: ['start 0.75', 'end 0.6'],
  })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  // Oldest first — the story travels forward in time
  const milestones: Milestone[] = [
    {
      period: education.period,
      company: education.college.split('-')[0].trim(),
      role: education.degree,
      body: `Where it started — ${education.degree}, graduating with ${education.cgpa}. The foundation in IT that turned a curiosity about how software works into a career building it.`,
      chips: [education.cgpa, education.location],
      accent: '#4cd9ed',
    },
    ...[...workExperience].reverse().map((exp, i) => ({
      period: exp.period,
      company: exp.company,
      role: exp.role,
      body:
        exp.note ??
        `Leading frontend for ${exp.client ?? exp.company} — owning a portal that processes 1.5 lakh orders a day, managing a team of 5, and shipping across web, mobile, and backend.`,
      chips: exp.projects.filter((p) => p.featured).map((p) => p.name.split('—')[0].trim()),
      accent: ['#fbbf24', '#8b7bff', '#ff6535'][i] ?? '#ff6535',
      url: exp.website,
      client: exp.client ? { name: exp.client, url: exp.clientWebsite } : undefined,
    })),
  ]

  return (
    <section id="about" className="section">
      <SectionHead
        kicker="01 · The Journey"
        title={
          <>
            From first commit to <span className="text-aurora">production scale.</span>
          </>
        }
        sub={personal.aboutExtended}
      />

      <div className="journey" ref={spineRef}>
        <div className="journey-spine">
          <motion.span className="spine-fill" style={{ scaleY: fill }} />
        </div>
        {milestones.map((m, i) => (
          <JourneyItem key={m.company + m.period} m={m} index={i} />
        ))}
      </div>
    </section>
  )
}
