import { useState, useEffect } from 'react'
import { EASE } from '../utils/motion'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { PersonalProject } from '../types'
import { TechBadge } from './TechIcon'
import LinkButtons from './LinkButtons'

interface Props { projects: PersonalProject[] }

// ── Lightbox ────────────────────────────────────────────────────
function Lightbox({ shots, active, color, name, onClose, onPrev, onNext }: {
  shots: string[]; active: number; color: string; name: string;
  onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onPrev()
      else if (e.key === 'ArrowRight') onNext()
      else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'zoom-out', padding: '60px 80px',
      }}
    >
      <button onClick={onClose} style={lbBtn({ position: 'fixed', top: 20, right: 20 })}>✕</button>
      {shots.length > 1 && (
        <button onClick={e => { e.stopPropagation(); onPrev() }} style={lbBtn({ position: 'fixed', left: 20, top: '50%', transform: 'translateY(-50%)' })}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
      )}
      <AnimatePresence mode="wait">
        <motion.img
          key={active} src={shots[active]} alt={`${name} ${active + 1}`}
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -12 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          style={{ maxWidth: '90vw', maxHeight: '78vh', objectFit: 'contain', borderRadius: 12, boxShadow: `0 0 0 1px ${color}30, 0 40px 100px rgba(0,0,0,0.6)`, cursor: 'default' }}
        />
      </AnimatePresence>
      {shots.length > 1 && (
        <button onClick={e => { e.stopPropagation(); onNext() }} style={lbBtn({ position: 'fixed', right: 20, top: '50%', transform: 'translateY(-50%)' })}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      )}
      {shots.length > 1 && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span>{active + 1} / {shots.length}</span>
          <span style={{ opacity: 0.4 }}>·</span><span>ESC to close</span>
          <span style={{ opacity: 0.4 }}>·</span><span>← → navigate</span>
        </div>
      )}
    </motion.div>
  )
}

function lbBtn(extra: React.CSSProperties): React.CSSProperties {
  return { zIndex: 1001, width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', ...extra }
}

// ── Featured hero card (for projects with screenshots) ──────────
function FeaturedProjectCard({ project }: { project: PersonalProject }) {
  const navigate = useNavigate()
  const shots = project.screenshots ?? []
  const color = project.color
  const [activeImg, setActiveImg] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const prevLb = () => setLightbox(i => i !== null ? (i - 1 + shots.length) % shots.length : null)
  const nextLb = () => setLightbox(i => i !== null ? (i + 1) % shots.length : null)

  useEffect(() => {
    if (shots.length <= 1) return
    const t = setInterval(() => setActiveImg(i => (i + 1) % shots.length), 2800)
    return () => clearInterval(t)
  }, [shots.length])

  return (
    <>
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox shots={shots} active={lightbox} color={color} name={project.name}
            onClose={() => setLightbox(null)} onPrev={prevLb} onNext={nextLb} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: EASE }}
        whileHover={{ y: -3 }}
        style={{ marginBottom: 20 }}
      >
        <div
          style={{
            background: 'var(--bg-card)',
            border: `1px solid ${color}28`,
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden', cursor: 'pointer',
            transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
            boxShadow: 'var(--shadow-card)',
          }}
          onClick={() => navigate(`/project/${project.id}`)}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px ${color}22`
            ;(e.currentTarget as HTMLElement).style.borderColor = `${color}50`
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)'
            ;(e.currentTarget as HTMLElement).style.borderColor = `${color}28`
          }}
        >
          {/* Top accent */}
          <div style={{ height: 3, background: `linear-gradient(90deg, ${color}, ${color}00)` }} />

          <div className="pp-featured-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px' }}>
            {/* LEFT: info */}
            <div style={{ padding: '28px 32px', background: `linear-gradient(135deg, ${color}08 0%, transparent 55%)` }}>
              {/* Badges row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 10.5, background: `${color}15`, color, border: `1px solid ${color}28`, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                  {project.type}
                </span>
                <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 10.5, background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent-border)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  ★ Featured
                </span>
              </div>

              <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)', marginBottom: 10 }}>
                {project.name}
              </h3>

              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 16, maxWidth: 480 }}>
                {project.summary}
              </p>

              {/* Highlight pill */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 100, background: `${color}10`, border: `1px solid ${color}22`, marginBottom: 20 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color, fontFamily: 'var(--font-mono)' }}>
                  {project.highlight}
                </span>
              </div>

              {/* Features */}
              {project.features.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 20px', marginBottom: 20 }}>
                  {project.features.slice(0, 4).map(f => (
                    <div key={f} style={{ fontSize: 12.5, color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 6, lineHeight: 1.5 }}>
                      <span style={{ color, fontSize: 7, marginTop: 4, flexShrink: 0 }}>▸</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tech + links */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {project.tech.slice(0, 5).map(t => <TechBadge key={t} tech={t} />)}
                {project.tech.length > 5 && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 10px', borderRadius: 100, fontSize: 12, fontFamily: 'var(--font-body)', background: 'var(--bg-card-hover)', border: '1px solid var(--border)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    +{project.tech.length - 5}
                  </span>
                )}
              </div>

              <LinkButtons links={project.links} color={color} onNavigate={() => navigate(`/project/${project.id}`)} />
            </div>

            {/* RIGHT: auto-cycling screenshots */}
            <div
              style={{ position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg, ${color}0a, ${color}18)`, minHeight: 260 }}
              onClick={e => { e.stopPropagation(); navigate(`/project/${project.id}`, { state: { scrollToScreenshots: true } }) }}
            >
              {/* Left-edge fade */}
              <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 60, zIndex: 2, background: 'linear-gradient(90deg, var(--bg-card), transparent)', pointerEvents: 'none' }} />

              <AnimatePresence mode="sync">
                <motion.img
                  key={activeImg}
                  src={shots[activeImg]}
                  alt={`${project.name} preview`}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left', cursor: 'zoom-in' }}
                />
              </AnimatePresence>

              {/* Dot nav */}
              {shots.length > 1 && (
                <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4, zIndex: 3 }}>
                  {shots.map((_, i) => (
                    <div
                      key={i}
                      onClick={e => { e.stopPropagation(); setActiveImg(i) }}
                      style={{ height: 3, borderRadius: 2, cursor: 'pointer', width: i === activeImg ? 16 : 4, background: i === activeImg ? color : `${color}55`, transition: 'width 0.3s ease' }}
                    />
                  ))}
                </div>
              )}

              {/* Zoom hint */}
              <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 3, background: 'rgba(0,0,0,0.45)', borderRadius: 6, padding: '3px 7px', backdropFilter: 'blur(6px)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

// ── Compact card (for projects without screenshots) ─────────────
function CompactCard({ project, index }: { project: PersonalProject; index: number }) {
  const navigate = useNavigate()
  const color = project.color

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: EASE }}
      whileHover={{ y: -3 }}
      style={{ height: '100%' }}
    >
      <div
        style={{
          display: 'flex', flexDirection: 'column', height: '100%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 22px',
          cursor: 'pointer', position: 'relative', overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
          transition: 'border-color 0.22s ease, box-shadow 0.22s ease',
        }}
        onClick={() => navigate(`/project/${project.id}`)}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = `${color}45`
          ;(e.currentTarget as HTMLElement).style.boxShadow = `0 12px 36px ${color}18`
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)'
        }}
      >
        {/* Top accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />

        {/* Header: color dot + type */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, boxShadow: `0 0 6px ${color}80` }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.09em' }}>
              {project.category ?? project.type}
            </span>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ opacity: 0.5, flexShrink: 0 }}>
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </div>

        {/* Name */}
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6, letterSpacing: '-0.01em' }}>
          {project.name}
        </div>

        {/* Summary */}
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 12, flex: 1 }}>
          {project.summary}
        </p>

        {/* Highlight pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 100, background: `${color}10`, border: `1px solid ${color}20`, marginBottom: 14, alignSelf: 'flex-start' }}>
          <span style={{ fontSize: 10.5, color, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>✦ {project.highlight}</span>
        </div>

        {/* Tech badges — clipped row */}
        <div style={{ overflow: 'hidden', maskImage: 'linear-gradient(to right, black 80%, transparent)', WebkitMaskImage: 'linear-gradient(to right, black 80%, transparent)', marginBottom: 14 }}>
          <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 5 }}>
            {project.tech.slice(0, 4).map(t => <TechBadge key={t} tech={t} />)}
          </div>
        </div>

        <LinkButtons links={project.links} color={color} onNavigate={() => navigate(`/project/${project.id}`)} />
      </div>
    </motion.div>
  )
}

// ── Section ─────────────────────────────────────────────────────
export default function PersonalProjects({ projects }: Props) {
  const featured = projects.filter(p => (p.screenshots ?? []).length > 0)
  const compact  = projects.filter(p => (p.screenshots ?? []).length === 0)

  return (
    <section id="projects" className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ marginBottom: 44 }}
        >
          <span className="section-label">Personal Projects</span>
          <h2 className="section-title">Things I built for fun</h2>
          <p className="section-subtitle">
            Side projects, experiments, and open-source work — built because the problem was interesting.
          </p>
        </motion.div>

        {/* Featured hero cards (have screenshots) */}
        {featured.map(p => (
          <FeaturedProjectCard key={p.id} project={p} />
        ))}

        {/* Compact grid (no screenshots) */}
        {compact.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {compact.map((p, i) => (
              <CompactCard key={p.id} project={p} index={i} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 700px) {
          .pp-featured-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
