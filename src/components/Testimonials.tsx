import { motion } from 'framer-motion'
import { EASE } from '../utils/motion'
import type { Testimonial } from '../types'

interface Props {
  testimonials: Testimonial[]
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

function initials(name: string) {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
}

export default function Testimonials({ testimonials }: Props) {
  return (
    <section id="testimonials" className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ marginBottom: 44 }}
        >
          <span className="section-label">Testimonials</span>
          <h2 className="section-title">What people I've worked with say</h2>
          <p className="section-subtitle">
            A few words from managers, teammates, and clients I've shipped alongside.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 18,
          }}
        >
          {testimonials.map((t, i) => (
            <motion.figure
              key={i}
              variants={item}
              whileHover={{ y: -5 }}
              style={{
                position: 'relative', margin: 0,
                background: 'color-mix(in srgb, var(--bg-card) 70%, transparent)',
                backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px 26px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex', flexDirection: 'column', gap: 18,
                transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent-border)'
                e.currentTarget.style.boxShadow = 'var(--shadow-hover)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.boxShadow = 'var(--shadow-card)'
              }}
            >
              {/* Quote mark */}
              <span style={{
                fontFamily: 'var(--font-heading)', fontSize: 56, lineHeight: 0.6,
                color: 'var(--accent)', opacity: 0.18, height: 22,
              }}>"</span>

              <blockquote style={{
                margin: 0, fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)',
                flex: 1,
              }}>
                {t.quote}
              </blockquote>

              <figcaption style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {t.avatar
                  ? <img src={t.avatar} alt={t.name} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  : <span style={{
                      width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--accent-soft)', border: '1px solid var(--accent-border)',
                      color: 'var(--accent)', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14,
                    }}>{initials(t.name)}</span>
                }
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{t.name}</span>
                    {t.linkedin && (
                      <a href={t.linkedin} target="_blank" rel="noreferrer" aria-label={`${t.name} on LinkedIn`}
                        style={{ display: 'inline-flex', color: 'var(--text-muted)' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                        </svg>
                      </a>
                    )}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.role}{t.company ? ` · ${t.company}` : ''}
                  </div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
