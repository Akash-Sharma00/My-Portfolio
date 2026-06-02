import { useState, useEffect } from 'react'
import { EASE } from '../utils/motion'
import { motion, AnimatePresence } from 'framer-motion'
import type { PersonalProject, Contribution } from '../types'
import ProjectCard from './ProjectCard'
import LinkButtons from './LinkButtons'

interface Props {
  projects: PersonalProject[]
  contributions: Contribution[]
}

function ContributionRow({ c, index }: { c: Contribution; index: number }) {
  const [active, setActive] = useState<number | null>(null)
  const shots = c.screenshots ?? []
  const color = c.color || 'var(--accent)'

  const prev = () => setActive(i => i !== null ? (i - 1 + shots.length) % shots.length : null)
  const next = () => setActive(i => i !== null ? (i + 1) % shots.length : null)

  useEffect(() => {
    if (active === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Escape') setActive(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.07 }}
        style={{
          background: 'var(--bg-card)',
          border: `1px solid ${c.color ? c.color + '30' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
        }}
      >
        {/* Main row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px' }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
            background: c.color || 'var(--text-muted)',
            boxShadow: c.color ? `0 0 6px ${c.color}60` : 'none',
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginRight: 10 }}>{c.name}</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.description}</span>
          </div>
          <LinkButtons links={c.links} color={color} size="sm" />
        </div>

        {/* Screenshot strip */}
        {shots.length > 0 && (
          <div style={{
            display: 'flex', gap: 6,
            padding: '0 18px 12px',
            overflowX: 'auto', scrollbarWidth: 'none',
          }}>
            {shots.map((src, j) => (
              <motion.img
                key={j}
                src={src}
                alt={`${c.name} ${j + 1}`}
                whileHover={{ scale: 1.04, y: -2 }}
                transition={{ duration: 0.15 }}
                onClick={() => setActive(j)}
                style={{
                  height: 80, width: 'auto',
                  borderRadius: 7,
                  objectFit: 'cover',
                  border: `1px solid ${c.color ? c.color + '30' : 'var(--border)'}`,
                  flexShrink: 0,
                  cursor: 'zoom-in',
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActive(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'zoom-out', padding: '60px 80px 80px',
            }}
          >
            {/* Close */}
            <button onClick={() => setActive(null)} style={lbBtn({ position: 'fixed', top: 20, right: 20 })}>✕</button>

            {/* Prev */}
            {shots.length > 1 && (
              <button onClick={e => { e.stopPropagation(); prev() }} style={lbBtn({ position: 'fixed', left: 20, top: '50%', transform: 'translateY(-50%)' })}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
            )}

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={active}
                src={shots[active]}
                alt={`${c.name} ${active + 1}`}
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -12 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                onClick={e => e.stopPropagation()}
                style={{
                  maxWidth: '90vw', maxHeight: '78vh',
                  objectFit: 'contain', borderRadius: 12,
                  boxShadow: `0 0 0 1px ${c.color || '#fff'}30, 0 40px 100px rgba(0,0,0,0.6)`,
                  cursor: 'default',
                }}
              />
            </AnimatePresence>

            {/* Next */}
            {shots.length > 1 && (
              <button onClick={e => { e.stopPropagation(); next() }} style={lbBtn({ position: 'fixed', right: 20, top: '50%', transform: 'translateY(-50%)' })}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            )}

            {/* Counter + hint */}
            {shots.length > 1 && (
              <div style={{
                position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
                fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span>{active + 1} / {shots.length}</span>
                <span style={{ opacity: 0.4 }}>·</span>
                <span>ESC to close</span>
                <span style={{ opacity: 0.4 }}>·</span>
                <span>← → navigate</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function lbBtn(extra: React.CSSProperties): React.CSSProperties {
  return {
    zIndex: 1001,
    width: 40, height: 40, borderRadius: 10,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backdropFilter: 'blur(8px)',
    ...extra,
  }
}

export default function PersonalProjects({ projects, contributions }: Props) {
  return (
    <section id="projects" className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ marginBottom: 48 }}
        >
          <span className="section-label">Personal Projects</span>
          <h2 className="section-title">Things I built for fun</h2>
          <p className="section-subtitle">
            Side projects, experiments, and open-source work. Built because the problem was interesting.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20, marginBottom: 64 }}>
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {contributions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 16 }}>
              Contributions & Prototypes
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {contributions.map((c, i) => (
                <ContributionRow key={c.name} c={c} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
