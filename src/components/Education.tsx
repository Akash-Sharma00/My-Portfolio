import { EASE } from '../utils/motion'
import { motion } from 'framer-motion'
import type { Education as EducationType } from '../types'

interface Props { education: EducationType; learnings: string[] }

export default function Education({ education, learnings }: Props) {
  return (
    <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }} className="edu-grid">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <span className="section-label">Education</span>
            <h2 className="section-title" style={{ marginBottom: 32 }}>Background</h2>

            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: 32,
              position: 'relative', overflow: 'hidden',
              boxShadow: 'var(--shadow-card)',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: 'linear-gradient(180deg, var(--accent), transparent)' }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {education.period}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 8, fontFamily: 'var(--font-heading)' }}>
                {education.degree}
              </div>
              <div style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 4 }}>{education.college}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>{education.location}</div>
              <motion.div
                initial={{ scale: 0.88, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 18px', background: 'var(--accent-soft)', borderRadius: 100, border: '1px solid var(--accent-border)' }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>CGPA</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>
                  {education.cgpa.replace(' CGPI', '')}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>/ 10</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
          >
            <span className="section-label">Learnings</span>
            <h2 className="section-title" style={{ marginBottom: 32 }}>What I've figured out</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {learnings.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i, duration: 0.35, ease: EASE }}
                  whileHover={{ x: 4 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 14px', background: 'var(--bg-card)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                    fontSize: 13, color: 'var(--text-secondary)',
                    cursor: 'default',
                    boxShadow: 'var(--shadow-card)',
                    transition: 'border-color 0.2s ease, color 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent-border)'
                    e.currentTarget.style.color = 'var(--text)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--text-secondary)'
                  }}
                >
                  <span style={{ color: 'var(--accent)', fontSize: 12, flexShrink: 0 }}>→</span>
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) { .edu-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }
      `}</style>
    </section>
  )
}
