import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Portfolio, Project, PersonalProject } from '../types'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { TechBadge } from '../components/TechIcon'
import LinkButtonsRow from '../components/LinkButtons'

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
  const thumbsRef = useRef<HTMLDivElement>(null)

  const prev = () => setActive(i => (i - 1 + screenshots.length) % screenshots.length)
  const next = () => setActive(i => (i + 1) % screenshots.length)

  // Scroll active thumbnail into view
  useEffect(() => {
    const strip = thumbsRef.current
    if (!strip) return
    const thumb = strip.children[active] as HTMLElement
    if (thumb) thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [active])

  // Keyboard nav in lightbox
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

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}>
        {/* Header bar */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.09em' }}>
            Screenshots · {screenshots.length} screens
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {[prev, next].map((fn, idx) => (
              <button key={idx} onClick={fn} style={{
                width: 30, height: 30, borderRadius: 7,
                background: 'var(--bg)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14,
                transition: 'border-color 0.15s, color 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                {idx === 0 ? '←' : '→'}
              </button>
            ))}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', minWidth: 36, textAlign: 'center' }}>
              {active + 1}/{screenshots.length}
            </span>
          </div>
        </div>

        {/* Main image */}
        <div
          style={{
            position: 'relative', background: 'var(--bg)',
            cursor: 'zoom-in', overflow: 'hidden',
          }}
          onClick={() => setLightbox(true)}
        >
          <motion.img
            key={active}
            src={screenshots[active]}
            alt={caption || `${name} screenshot ${active + 1}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            style={{
              width: '100%', height: 'auto',
              maxHeight: '520px',
              objectFit: 'contain',
              display: 'block',
            }}
          />
          {/* Zoom hint overlay */}
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
            borderRadius: 7, padding: '4px 10px',
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.7)',
            pointerEvents: 'none',
          }}>
            click to expand
          </div>
        </div>

        {/* Caption */}
        {caption && (
          <div style={{
            padding: '12px 24px',
            borderTop: '1px solid var(--border)',
            fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5,
          }}>
            <span style={{ color: color, marginRight: 6, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
              {String(active + 1).padStart(2, '0')}
            </span>
            {caption}
          </div>
        )}

        {/* Thumbnail strip */}
        <div
          ref={thumbsRef}
          style={{
            display: 'flex', gap: 8, padding: '12px 16px',
            overflowX: 'auto', borderTop: '1px solid var(--border)',
            scrollbarWidth: 'none',
          }}
        >
          {screenshots.map((src, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              style={{
                flexShrink: 0,
                width: 88, height: 56,
                borderRadius: 8, overflow: 'hidden',
                border: `2px solid ${i === active ? color : 'transparent'}`,
                cursor: 'pointer',
                opacity: i === active ? 1 : 0.45,
                transition: 'opacity 0.18s, border-color 0.18s, transform 0.18s',
                background: 'var(--bg)',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.05)' }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = i === active ? '1' : '0.45'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <img src={src} alt={`thumb ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.94)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out', padding: '60px 80px 80px',
          }}
        >
          {/* Close */}
          <button onClick={() => setLightbox(false)} style={{
            position: 'fixed', top: 20, right: 20, zIndex: 1001,
            width: 36, height: 36, borderRadius: 8,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', fontSize: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>

          {/* Prev */}
          <button onClick={e => { e.stopPropagation(); prev() }} style={{
            position: 'fixed', left: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 1001,
            width: 48, height: 48, borderRadius: 12,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', fontSize: 20, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>←</button>

          {/* Image */}
          <motion.img
            key={`lb-${active}`}
            src={screenshots[active]}
            alt={caption || `${name} ${active + 1}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '100%', maxHeight: '80vh',
              objectFit: 'contain', borderRadius: 12,
              boxShadow: `0 32px 80px ${color}40`,
              cursor: 'default',
            }}
          />

          {/* Caption */}
          {caption && (
            <div style={{
              marginTop: 16, maxWidth: 680, textAlign: 'center',
              fontFamily: 'var(--font-body)', fontSize: 13,
              color: 'rgba(255,255,255,0.55)', lineHeight: 1.6,
            }}>
              <span style={{ color, marginRight: 6, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                {String(active + 1).padStart(2, '0')}
              </span>
              {caption}
            </div>
          )}

          {/* Next */}
          <button onClick={e => { e.stopPropagation(); next() }} style={{
            position: 'fixed', right: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 1001,
            width: 48, height: 48, borderRadius: 12,
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', fontSize: 20, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>→</button>

          {/* Counter hint */}
          <div style={{
            position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.3)',
          }}>
            {active + 1} / {screenshots.length} · ESC to close · ← → to navigate
          </div>
        </div>
      )}
    </div>
  )
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
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
      <main style={{ paddingTop: 'calc(var(--nav-height) + 60px)', paddingBottom: 80 }}>
        <div className="container" style={{ maxWidth: 860, margin: '0 auto' }}>
          {/* Back link */}
          <Link
            to="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 14, color: 'var(--text-muted)', marginBottom: 48,
              fontFamily: 'var(--font-mono)',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to portfolio
          </Link>

          {/* Header */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '40px 44px',
            marginBottom: 32,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Color gradient accent */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, ${color}, transparent)`,
            }} />
            <div style={{
              position: 'absolute', top: 0, right: 0, width: '40%', height: '100%',
              background: `radial-gradient(ellipse at 100% 0%, ${color}08, transparent 70%)`,
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
                <div>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: 100,
                    fontSize: 11,
                    background: `${color}15`,
                    color: color,
                    border: `1px solid ${color}30`,
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 12,
                  }}>
                    {project.type}
                  </span>
                  <h1 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(24px, 4vw, 40px)',
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    color: 'var(--text)',
                    lineHeight: 1.2,
                    marginBottom: 8,
                  }}>
                    {project.name}
                  </h1>
                  {workProject && (
                    <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                      {workProject.company}
                    </span>
                  )}
                </div>

                <div>
                  <LinkButtonsRow links={links} color={color} size="md" />
                </div>
              </div>

              <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {project.summary}
              </p>
            </div>
          </div>

          {/* Impact / highlight banner */}
          {workProject?.impact && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '16px 24px',
              background: `${color}0c`,
              border: `1px solid ${color}25`,
              borderRadius: 'var(--radius)',
              marginBottom: 32,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: color }}>{workProject.impact}</div>
                {workProject.impactDetail && (
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{workProject.impactDetail}</div>
                )}
              </div>
            </div>
          )}

          {personalProject?.highlight && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '16px 24px',
              background: `${color}0c`,
              border: `1px solid ${color}25`,
              borderRadius: 'var(--radius)',
              marginBottom: 32,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: color }}>✦ {personalProject.highlight}</div>
            </div>
          )}

          {/* Screenshot Gallery */}
          {project.screenshots && project.screenshots.length > 0 && (
            <ScreenshotGallery
              screenshots={project.screenshots}
              captions={(project as typeof project & { screenshotCaptions?: string[] }).screenshotCaptions}
              color={color}
              name={project.name}
            />
          )}

          <div className="project-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
            {/* Description */}
            <div>
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 36px',
                marginBottom: 24,
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
                  About this project
                </div>
                {paragraphs.map((para, i) => (
                  <p key={i} style={{
                    fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8,
                    marginBottom: i < paragraphs.length - 1 ? 16 : 0,
                  }}>
                    {para}
                  </p>
                ))}
              </div>

              {/* Features */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 36px',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
                  Key features
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {project.features.map((feature, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: 4,
                        background: `${color}15`, border: `1px solid ${color}30`,
                        color: color, fontSize: 10, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginTop: 2,
                      }}>
                        ✓
                      </span>
                      <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Tech stack */}
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                  Tech Stack
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {project.tech.map(t => (
                    <motion.div
                      key={t}
                      initial={{ opacity: 0, scale: 0.88 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TechBadge tech={t} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Links */}
              {Object.values(links).some(v => v && v !== '#') && (
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                    Links
                  </div>
                  <LinkButtonsRow links={links} color={color} size="md" />
                </div>
              )}

              {/* Company context for work projects */}
              {workProject && (
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                    Context
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Built at <span style={{ color: 'var(--text)', fontWeight: 600 }}>{workProject.company}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Other projects */}
          <div style={{ marginTop: 64, paddingTop: 48, borderTop: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
              More projects
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {data.personalProjects
                .filter(p => p.id !== id)
                .slice(0, 4)
                .map(p => (
                  <Link key={p.id} to={`/project/${p.id}`} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '8px 16px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 100,
                    fontSize: 13, color: 'var(--text-secondary)',
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--border-hover)'
                      e.currentTarget.style.color = 'var(--text)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.color = 'var(--text-secondary)'
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, flexShrink: 0, display: 'inline-block' }} />
                    {p.name}
                  </Link>
                ))}
              <Link to="/" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 16px',
                background: 'var(--accent-soft)',
                border: '1px solid var(--accent-border)',
                borderRadius: 100,
                fontSize: 13, color: 'var(--accent)',
              }}>
                View all →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .project-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  )
}
