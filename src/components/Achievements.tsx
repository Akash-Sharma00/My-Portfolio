import { motion } from 'framer-motion'
import { EASE } from '../utils/motion'
import type { Stat } from '../types'
import Counter from './Counter'

interface Props {
  stats: Stat[]
  github: string
}

export default function Achievements({ stats, github }: Props) {
  return (
    <section id="achievements" className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ textAlign: 'center', marginBottom: 44 }}
        >
          <span className="section-label" style={{ textAlign: 'center' }}>By the numbers</span>
          <h2 className="section-title">Impact, quantified</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Real metrics from real products — not side-project vanity counts.
          </p>
        </motion.div>

        {/* Glass counter band */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            position: 'relative', overflow: 'hidden',
            display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
            gap: 1, background: 'var(--border)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
          }}
          className="achv-grid"
        >
          {/* Soft glow wash behind the band */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 50% 0%, var(--accent-glow), transparent 60%)',
          }} />

          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, ease: EASE }}
              style={{
                position: 'relative',
                background: 'var(--bg-card)',
                padding: '38px 20px', textAlign: 'center',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-heading)', fontWeight: 700,
                fontSize: 'clamp(34px, 6vw, 56px)', letterSpacing: '-0.04em',
                lineHeight: 1, color: 'var(--text)',
                background: 'linear-gradient(180deg, var(--text), var(--text-secondary))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                <Counter value={stat.value} />
                {stat.suffix && (
                  <span style={{ fontSize: '0.4em', color: 'var(--accent)', WebkitTextFillColor: 'var(--accent)' }}>
                    {stat.suffix}
                  </span>
                )}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, marginTop: 12,
                color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em',
                lineHeight: 1.5,
              }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}
        >
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost"
            style={{ fontSize: 13 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-1.7c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
            </svg>
            View my GitHub
          </a>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .achv-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  )
}
