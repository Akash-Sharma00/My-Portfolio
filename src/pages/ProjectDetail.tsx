import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { Portfolio, Project, PersonalProject } from '../types'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import TechIcon, { TECH_MAP } from '../components/TechIcon'
import LinkButtonsRow from '../components/LinkButtons'
import PageBg from '../components/PageBg'

type AnyProject = (Project & { _kind: 'work' }) | (PersonalProject & { _kind: 'personal' })

function findProject(data: Portfolio, id: string): AnyProject | null {
  for (const exp of data.workExperience) {
    const p = exp.projects.find(p => p.id === id)
    if (p) return { ...p, _kind: 'work' } as AnyProject
  }
  const pp = data.personalProjects.find(p => p.id === id)
  if (pp) return { ...pp, _kind: 'personal' } as AnyProject
  return null
}

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
}

function SectionCard({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.45, ease, delay }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

function TechTile({ tech, delay = 0 }: { tech: string; delay?: number }) {
  const def = TECH_MAP[tech] || { color: '#888888' }
  const c = def.color

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease }}
      whileHover={{ scale: 1.06, y: -3 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        padding: '20px 18px',
        background: `${c}0d`,
        border: `1px solid ${c}35`,
        borderRadius: 14,
        cursor: 'default',
        minWidth: 90, flex: '0 0 auto',
        boxShadow: `0 2px 12px ${c}10`,
        transition: 'box-shadow 0.2s',
      }}
    >
      <TechIcon tech={tech} size={32} />
      <span style={{
        fontSize: 11, color: 'var(--text-secondary)',
        fontFamily: 'var(--font-mono)', fontWeight: 500,
        textAlign: 'center', lineHeight: 1.3,
        maxWidth: 80,
      }}>
        {tech}
      </span>
    </motion.div>
  )
}

function ScreenshotGallery({
  screenshots, color, name, captions = [],
}: {
  screenshots: string[]
  color: string
  name: string
  captions?: string[]
}) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const thumbsRef = useRef<HTMLDivElement>(null)

  const prev = () => { setImgLoaded(false); setActive(i => (i - 1 + screenshots.length) % screenshots.length) }
  const next = () => { setImgLoaded(false); setActive(i => (i + 1) % screenshots.length) }

  useEffect(() => {
    const strip = thumbsRef.current
    if (!strip) return
    const thumb = strip.children[active] as HTMLElement
    if (thumb) thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [active])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Escape') setLightbox(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, active])

  const caption = captions[active]
  const progress = ((active + 1) / screenshots.length) * 100

  return (
    <SectionCard delay={0.1} style={{ marginBottom: 28 }}>
      <div style={sectionLabel}>Screenshots</div>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: `0 0 0 1px var(--border), 0 8px 40px rgba(0,0,0,0.12)`,
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.85 }} />
              ))}
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', opacity: 0.7 }}>
              {name}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={prev} style={navBtnStyle}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', minWidth: 34, textAlign: 'center' }}>
              {active + 1}/{screenshots.length}
            </span>
            <button onClick={next} style={navBtnStyle}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 2, background: 'var(--border)', position: 'relative' }}>
          <motion.div
            style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: color, borderRadius: 2 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease }}
          />
        </div>

        {/* Main image */}
        <div
          style={{
            position: 'relative',
            background: `linear-gradient(135deg, var(--bg) 0%, color-mix(in srgb, ${color} 4%, var(--bg)) 100%)`,
            cursor: 'zoom-in',
            minHeight: 280,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setLightbox(true)}
        >
          {!imgLoaded && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                border: `2px solid var(--border)`,
                borderTopColor: color,
                animation: 'spin 0.7s linear infinite',
              }} />
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.img
              key={active}
              src={screenshots[active]}
              alt={caption || `${name} screenshot ${active + 1}`}
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: imgLoaded ? 1 : 0, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.3, ease }}
              onLoad={() => setImgLoaded(true)}
              style={{
                width: '100%', height: 'auto',
                maxHeight: '560px',
                objectFit: 'contain',
                display: 'block',
                padding: '12px',
              }}
            />
          </AnimatePresence>

          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
            borderRadius: 6, padding: '3px 8px',
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.65)',
            pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
            zoom
          </div>
        </div>

        {caption && (
          <div style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--border)',
            fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5,
            display: 'flex', alignItems: 'baseline', gap: 8,
          }}>
            <span style={{ color, fontFamily: 'var(--font-mono)', fontSize: 10, flexShrink: 0, marginTop: 1 }}>
              {String(active + 1).padStart(2, '0')}
            </span>
            {caption}
          </div>
        )}

        <div
          ref={thumbsRef}
          style={{
            display: 'flex', gap: 6, padding: '12px 14px',
            overflowX: 'auto', borderTop: '1px solid var(--border)',
            scrollbarWidth: 'none', background: 'var(--bg)',
          }}
        >
          {screenshots.map((src, i) => (
            <motion.div
              key={i}
              onClick={() => { setImgLoaded(false); setActive(i) }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              style={{
                flexShrink: 0, width: 80, height: 52,
                borderRadius: 7, overflow: 'hidden',
                border: `2px solid ${i === active ? color : 'transparent'}`,
                cursor: 'pointer', opacity: i === active ? 1 : 0.4,
                transition: 'opacity 0.2s, border-color 0.2s',
                background: 'var(--bg-card)',
                boxShadow: i === active ? `0 0 0 1px ${color}40` : 'none',
              }}
            >
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightbox(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'zoom-out', padding: '60px 80px 80px',
            }}
          >
            <button onClick={() => setLightbox(false)} style={lbBtnStyle('fixed', { top: 20, right: 20 })}>✕</button>
            <button onClick={e => { e.stopPropagation(); prev() }} style={lbBtnStyle('fixed', { left: 20, top: '50%', transform: 'translateY(-50%)' })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>

            <AnimatePresence mode="wait">
              <motion.img
                key={`lb-${active}`}
                src={screenshots[active]}
                alt={caption || `${name} ${active + 1}`}
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -12 }}
                transition={{ duration: 0.25, ease }}
                onClick={e => e.stopPropagation()}
                style={{
                  maxWidth: '90vw', maxHeight: '78vh',
                  objectFit: 'contain', borderRadius: 12,
                  boxShadow: `0 0 0 1px ${color}30, 0 40px 100px rgba(0,0,0,0.6), 0 0 80px ${color}20`,
                  cursor: 'default',
                }}
              />
            </AnimatePresence>

            {caption && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                  marginTop: 20, maxWidth: 640, textAlign: 'center',
                  fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6,
                }}
              >
                <span style={{ color, marginRight: 8, fontFamily: 'var(--font-mono)', fontSize: 10 }}>
                  {String(active + 1).padStart(2, '0')}
                </span>
                {caption}
              </motion.div>
            )}

            <button onClick={e => { e.stopPropagation(); next() }} style={lbBtnStyle('fixed', { right: 20, top: '50%', transform: 'translateY(-50%)' })}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>

            <div style={{
              position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
              fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span>{active + 1} / {screenshots.length}</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>ESC to close</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>← → navigate</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionCard>
  )
}

const navBtnStyle: React.CSSProperties = {
  width: 28, height: 28, borderRadius: 6,
  background: 'var(--bg-card)', border: '1px solid var(--border)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13,
  transition: 'border-color 0.15s, color 0.15s',
}

function lbBtnStyle(position: 'fixed' | 'absolute', extra: React.CSSProperties): React.CSSProperties {
  return {
    position, zIndex: 1001,
    width: 40, height: 40, borderRadius: 10,
    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backdropFilter: 'blur(8px)',
    ...extra,
  }
}

const sectionLabel: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: 10,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: 16,
}

const card: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: '28px 32px',
  marginBottom: 20,
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<Portfolio | null>(null)
  const [project, setProject] = useState<AnyProject | null>(null)

  useEffect(() => {
    fetch('/data/portfolio.json')
      .then(r => r.json())
      .then((d: Portfolio) => {
        setData(d)
        if (id) setProject(findProject(d, id))
      })
  }, [id])

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '2px solid var(--border)',
          borderTopColor: 'var(--accent)',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <p style={{ fontSize: 18, color: 'var(--text)' }}>Project not found.</p>
          <Link to="/" className="btn btn-ghost">← Back to portfolio</Link>
        </div>
        <Footer />
      </>
    )
  }

  const isWork = project._kind === 'work'
  const workProject = isWork ? (project as Project & { _kind: 'work' }) : null
  const personalProject = !isWork ? (project as PersonalProject & { _kind: 'personal' }) : null
  const color = project.color
  const links = project.links as Record<string, string>
  const description = project.description
  const paragraphs = description.split('\n\n').filter(Boolean)

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'calc(var(--nav-height) + 48px)', paddingBottom: 100 }}>
        <PageBg color={color} />

        <div className="container" style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>

          {/* ── 1. Hero header ──────────────────────────────── */}
          <SectionCard delay={0.05} style={{ marginBottom: 20 }}>
            <div style={{
              ...card,
              padding: '40px 44px 36px',
              marginBottom: 0,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, ${color}, ${color}60, transparent)`,
              }} />
              <div style={{
                position: 'absolute', top: 0, right: 0, width: '55%', height: '100%',
                background: `radial-gradient(ellipse at 100% 0%, ${color}0a, transparent 65%)`,
                pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute', bottom: -10, right: -10, width: 160, height: 160,
                backgroundImage: `radial-gradient(${color}18 1px, transparent 1px)`,
                backgroundSize: '16px 16px',
                pointerEvents: 'none',
              }} />

              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 100,
                        fontSize: 11, background: `${color}15`, color,
                        border: `1px solid ${color}30`,
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {project.type}
                      </span>
                      {workProject && (
                        <span style={{
                          padding: '3px 10px', borderRadius: 100,
                          fontSize: 11, background: 'var(--bg)',
                          color: 'var(--text-muted)', border: '1px solid var(--border)',
                          fontFamily: 'var(--font-mono)',
                        }}>
                          {workProject.company}
                        </span>
                      )}
                    </div>

                    <h1 style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(26px, 4.5vw, 44px)',
                      fontWeight: 700, letterSpacing: '-0.03em',
                      color: 'var(--text)', lineHeight: 1.15,
                      marginBottom: 16,
                    }}>
                      {project.name}
                    </h1>

                    <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 560 }}>
                      {project.summary}
                    </p>
                  </div>

                  <div style={{ flexShrink: 0, paddingTop: 4 }}>
                    <LinkButtonsRow links={links} color={color} size="md" />
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ── 2. Impact / highlight banner ────────────────── */}
          {(workProject?.impact || personalProject?.highlight) && (
            <SectionCard delay={0.12} style={{ marginBottom: 20 }}>
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.18 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '14px 20px',
                  background: `${color}09`,
                  border: `1px solid ${color}25`,
                  borderRadius: 'var(--radius)',
                  borderLeft: `3px solid ${color}`,
                }}
              >
                <div>
                  {workProject?.impact && (
                    <div style={{ fontSize: 14, fontWeight: 600, color, marginBottom: workProject.impactDetail ? 2 : 0 }}>
                      {workProject.impact}
                    </div>
                  )}
                  {workProject?.impactDetail && (
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{workProject.impactDetail}</div>
                  )}
                  {personalProject?.highlight && (
                    <div style={{ fontSize: 14, fontWeight: 600, color }}>✦ {personalProject.highlight}</div>
                  )}
                </div>
              </motion.div>
            </SectionCard>
          )}

          {/* ── 3. About ─────────────────────────────────────── */}
          <SectionCard delay={0.2} style={{ marginBottom: 20 }}>
            <div style={card}>
              <div style={sectionLabel}>About this project</div>
              {paragraphs.map((para, i) => (
                <p key={i} style={{
                  fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.85,
                  marginBottom: i < paragraphs.length - 1 ? 14 : 0,
                }}>
                  {para}
                </p>
              ))}
            </div>
          </SectionCard>

          {/* ── 4. Key Features ──────────────────────────────── */}
          <SectionCard delay={0.28} style={{ marginBottom: 20 }}>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={sectionLabel}>Key features</div>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color, background: `${color}12`,
                  border: `1px solid ${color}30`,
                  padding: '2px 8px', borderRadius: 100,
                }}>
                  {project.features.length} features
                </span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12,
              }}>
                {project.features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.34 + i * 0.055, duration: 0.35, ease }}
                    style={{
                      padding: '18px 20px',
                      background: `${color}07`,
                      border: `1px solid ${color}22`,
                      borderRadius: 12,
                      borderLeft: `3px solid ${color}80`,
                      display: 'flex', gap: 14, alignItems: 'flex-start',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700,
                      color, opacity: 0.35, lineHeight: 1.2,
                      flexShrink: 0, minWidth: 28, marginTop: 1,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.7 }}>
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* ── 5. Tech Stack ────────────────────────────────── */}
          <SectionCard delay={0.35} style={{ marginBottom: 20 }}>
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={sectionLabel}>Tech stack</div>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: 'var(--text-muted)', background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  padding: '2px 8px', borderRadius: 100,
                }}>
                  {project.tech.length} technologies
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {project.tech.map((t, i) => (
                  <TechTile key={t} tech={t} delay={0.4 + i * 0.04} />
                ))}
              </div>
            </div>
          </SectionCard>

          {/* ── 6. Links (optional extra) ────────────────────── */}
          {Object.values(links).some(v => v && v !== '#') && (
            <SectionCard delay={0.42} style={{ marginBottom: 20 }}>
              <div style={card}>
                <div style={sectionLabel}>Links</div>
                <LinkButtonsRow links={links} color={color} size="md" />
              </div>
            </SectionCard>
          )}

          {/* ── 7. Context (work only) ───────────────────────── */}
          {workProject && (
            <SectionCard delay={0.46} style={{ marginBottom: 20 }}>
              <div style={card}>
                <div style={sectionLabel}>Context</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Built at{' '}
                  <span style={{ color: 'var(--text)', fontWeight: 600 }}>{workProject.company}</span>
                </div>
              </div>
            </SectionCard>
          )}

          {/* ── 8. Screenshots — last ────────────────────────── */}
          {project.screenshots && project.screenshots.length > 0 && (
            <div style={{ marginTop: 40, paddingTop: 40, borderTop: '1px solid var(--border)' }}>
              <ScreenshotGallery
                screenshots={project.screenshots}
                captions={(project as typeof project & { screenshotCaptions?: string[] }).screenshotCaptions}
                color={color}
                name={project.name}
              />
            </div>
          )}

          {/* ── 9. More projects ─────────────────────────────── */}
          <SectionCard delay={0.55} style={{ marginTop: project.screenshots?.length ? 20 : 64, paddingTop: 48, borderTop: '1px solid var(--border)' }}>
            <div style={sectionLabel}>More projects</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
              {data.personalProjects
                .filter(p => p.id !== id)
                .slice(0, 4)
                .map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.06 }}
                  >
                    <Link to={`/project/${p.id}`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '7px 14px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 100,
                      fontSize: 13, color: 'var(--text-secondary)',
                      transition: 'all 0.15s',
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = p.color + '60'
                        e.currentTarget.style.color = 'var(--text)'
                        e.currentTarget.style.background = p.color + '08'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border)'
                        e.currentTarget.style.color = 'var(--text-secondary)'
                        e.currentTarget.style.background = 'var(--bg-card)'
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, flexShrink: 0, display: 'inline-block' }} />
                      {p.name}
                    </Link>
                  </motion.div>
                ))}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.84 }}>
                <Link to="/" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px',
                  background: 'var(--accent-soft)',
                  border: '1px solid var(--accent-border)',
                  borderRadius: 100,
                  fontSize: 13, color: 'var(--accent)',
                }}>
                  View all →
                </Link>
              </motion.div>
            </div>
          </SectionCard>
        </div>
      </main>
      <Footer />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .project-features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
