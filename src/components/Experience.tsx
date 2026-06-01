import { useNavigate } from 'react-router-dom'
import { EASE } from '../utils/motion'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { WorkExperience, Project } from '../types'
import { TechBadge } from './TechIcon'
import LinkButtons from './LinkButtons'

interface Props { experiences: WorkExperience[] }

// ── Key features list ──────────────────────────────────────────
function FeatureList({ features, color, max = 4 }: { features: string[]; color: string; max?: number }) {
  if (!features.length) return null
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 500,
      }}>
        Key Features
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 16px' }}>
        {features.slice(0, max).map(f => (
          <div key={f} style={{
            fontSize: 12, color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'flex-start', gap: 5, lineHeight: 1.45,
          }}>
            <span style={{ color, fontSize: 7, marginTop: 4, flexShrink: 0 }}>▸</span>
            <span>{f}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Featured card ──────────────────────────────────────────────
function FeaturedCard({ project }: { project: Project }) {
  const navigate = useNavigate()
  const color = project.color || '#ff6535'
  const shots = project.screenshots ?? []
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    if (shots.length <= 1) return
    const t = setInterval(() => setActiveImg(i => (i + 1) % shots.length), 2500)
    return () => clearInterval(t)
  }, [shots.length])

  const rightPanel = shots.length > 0 ? (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Left-edge fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: 60, zIndex: 2,
        background: 'linear-gradient(90deg, var(--bg-card), transparent)',
        pointerEvents: 'none',
      }} />
      <AnimatePresence mode="sync">
        <motion.img
          key={activeImg}
          src={shots[activeImg]}
          alt={`${project.name} preview`}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'top left',
          }}
        />
      </AnimatePresence>
      {shots.length > 1 && (
        <div style={{
          position: 'absolute', bottom: 10, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', gap: 4, zIndex: 3,
        }}>
          {shots.map((_, i) => (
            <div
              key={i}
              onClick={e => { e.stopPropagation(); setActiveImg(i) }}
              style={{
                height: 3, borderRadius: 2, cursor: 'pointer',
                width: i === activeImg ? 16 : 4,
                background: i === activeImg ? color : `${color}50`,
                transition: 'width 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  ) : (
    // Decorative panel — same width, so all featured cards are identical in shape
    <div style={{
      position: 'relative',
      background: `linear-gradient(135deg, ${color}0a 0%, ${color}1a 100%)`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', padding: '32px 16px', gap: 10,
    }}>
      <div style={{
        fontSize: 76, fontWeight: 800, lineHeight: 1,
        color: `${color}22`, fontFamily: 'var(--font-heading)', userSelect: 'none',
      }}>
        {project.name.charAt(0)}
      </div>
      <div style={{
        fontSize: 9, fontFamily: 'var(--font-mono)', color: `${color}55`,
        textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: 'center',
      }}>
        {project.type}
      </div>
      <div style={{
        position: 'absolute', top: -44, right: -44,
        width: 140, height: 140, borderRadius: '50%',
        border: `1px solid ${color}12`, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -24, left: -24,
        width: 90, height: 90, borderRadius: '50%',
        border: `1px solid ${color}09`, pointerEvents: 'none',
      }} />
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: EASE }}
      whileHover={{ y: -3 }}
      style={{ marginBottom: 14 }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: `1px solid ${color}28`,
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
        }}
        onClick={() => navigate(`/project/${project.id}`)}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 48px ${color}20`
          ;(e.currentTarget as HTMLElement).style.borderColor = `${color}50`
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = 'none'
          ;(e.currentTarget as HTMLElement).style.borderColor = `${color}28`
        }}
      >
        {/* Top accent line */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${color}, ${color}00)` }} />

        {/* Two-column grid — always 1fr + 290px so every featured card is the same shape */}
        <div className="featured-card-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 290px' }}>
          {/* LEFT: text */}
          <div style={{
            padding: '24px 28px',
            background: `linear-gradient(135deg, ${color}0a 0%, transparent 55%)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              <span style={{
                padding: '2px 9px', borderRadius: 100, fontSize: 10.5,
                background: `${color}15`, color, border: `1px solid ${color}28`,
                fontFamily: 'var(--font-mono)', fontWeight: 500,
              }}>
                {project.type}
              </span>
              <span style={{
                padding: '2px 9px', borderRadius: 100, fontSize: 10.5,
                background: 'var(--accent-soft)', color: 'var(--accent)',
                border: '1px solid var(--accent-border)',
                fontFamily: 'var(--font-mono)', fontWeight: 600,
              }}>
                ★ Featured
              </span>
            </div>

            <h3 style={{
              fontSize: 19, fontWeight: 700, color: 'var(--text)',
              letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)', marginBottom: 8,
            }}>
              {project.name}
            </h3>

            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 14 }}>
              {project.summary}
            </p>

            {project.impact && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '5px 12px', borderRadius: 100, marginBottom: 16,
                background: `${color}0e`, border: `1px solid ${color}22`,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color, fontFamily: 'var(--font-mono)' }}>
                  {project.impact}
                </span>
              </div>
            )}

            <FeatureList features={project.features} color={color} max={4} />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              {project.tech.slice(0, 5).map(t => <TechBadge key={t} tech={t} />)}
              {project.tech.length > 5 && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '5px 10px', borderRadius: 100,
                  fontSize: 12, fontWeight: 500,
                  fontFamily: 'var(--font-body)',
                  background: 'var(--bg-card-hover)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                }}>
                  +{project.tech.length - 5}
                </span>
              )}
            </div>

            <div style={{ marginTop: 18 }}>
              <LinkButtons links={project.links} color={color} onNavigate={() => navigate(`/project/${project.id}`)} />
            </div>
          </div>

          {/* RIGHT: screenshots or decorative */}
          {rightPanel}
        </div>
      </div>
    </motion.div>
  )
}

// ── Small card (non-featured) ──────────────────────────────────
function SmallCard({ project, delay = 0 }: { project: Project; delay?: number }) {
  const navigate = useNavigate()
  const color = project.color || '#888'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay, ease: EASE }}
      whileHover={{ y: -2 }}
      style={{ height: '100%' }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '18px 20px',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          position: 'relative', overflow: 'hidden',
          height: '100%', display: 'flex', flexDirection: 'column',
        }}
        onClick={() => navigate(`/project/${project.id}`)}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = `${color}40`
          ;(e.currentTarget as HTMLElement).style.boxShadow = `0 6px 24px ${color}12`
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
        }}
      >
        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${color}, transparent)`,
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{
            padding: '2px 8px', borderRadius: 100, fontSize: 10,
            background: `${color}12`, color, border: `1px solid ${color}22`,
            fontFamily: 'var(--font-mono)',
          }}>
            {project.type}
          </span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </div>

        <div style={{
          fontSize: 15, fontWeight: 600, color: 'var(--text)',
          marginBottom: 5, fontFamily: 'var(--font-heading)',
        }}>
          {project.name}
        </div>

        <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 10 }}>
          {project.summary}
        </p>

        <div style={{ flex: 1 }}>
          {project.features.slice(0, 3).map(f => (
            <div key={f} style={{
              fontSize: 11.5, color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'flex-start', gap: 5, marginBottom: 4,
            }}>
              <span style={{ color, fontSize: 7, marginTop: 3, flexShrink: 0 }}>▸</span>
              <span>{f}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 12, alignItems: 'center' }}>
          {project.tech.slice(0, 3).map(t => <TechBadge key={t} tech={t} />)}
          {project.tech.length > 3 && (
            <span style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '5px 10px', borderRadius: 100,
              fontSize: 12, fontWeight: 500,
              fontFamily: 'var(--font-body)',
              background: 'var(--bg-card-hover)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
            }}>
              +{project.tech.length - 3}
            </span>
          )}
        </div>

        <LinkButtons
          links={project.links}
          color={color}
          onNavigate={() => navigate(`/project/${project.id}`)}
        />
      </div>
    </motion.div>
  )
}

// ── Main section ───────────────────────────────────────────────
export default function Experience({ experiences }: Props) {
  const companies = experiences.reduce<WorkExperience[]>((acc, exp) => {
    const existing = acc.find(e => e.company === exp.company)
    if (!existing) {
      acc.push({
        ...exp,
        projects: experiences.filter(e => e.company === exp.company).flatMap(e => e.projects),
      })
    }
    return acc
  }, [])

  return (
    <section id="experience" className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ marginBottom: 64 }}
        >
          <span className="section-label">Experience</span>
          <h2 className="section-title">Where I've worked</h2>
          <p className="section-subtitle">
            3.9 years across logistics, healthcare, and consumer apps — always end-to-end.
          </p>
        </motion.div>

        {/* Companies quick-links strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 56 }}
        >
          {companies.flatMap(exp => {
            const items = []
            if (exp.website) items.push({ label: exp.company, url: exp.website, isClient: false })
            if (exp.clientWebsite) items.push({ label: exp.client!, url: exp.clientWebsite, isClient: true })
            return items
          }).map(({ label, url, isClient }) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '7px 14px', borderRadius: 'var(--radius)',
                background: isClient ? 'rgba(255,101,53,0.07)' : 'var(--bg-card)',
                border: isClient ? '1px solid rgba(255,101,53,0.25)' : '1px solid var(--border)',
                fontSize: 13, fontWeight: 500, color: isClient ? 'var(--accent)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-heading)',
                textDecoration: 'none',
                transition: 'border-color 0.2s, color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = isClient ? 'rgba(255,101,53,0.55)' : 'var(--accent)'
                el.style.color = 'var(--accent)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = isClient ? 'rgba(255,101,53,0.25)' : 'var(--border)'
                el.style.color = isClient ? 'var(--accent)' : 'var(--text-secondary)'
              }}
            >
              {isClient && <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--accent)', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>client</span>}
              {isClient && <span style={{ color: 'rgba(255,101,53,0.3)', fontSize: 12 }}>|</span>}
              {label}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.5 }}>
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </a>
          ))}
        </motion.div>

        <div style={{ position: 'relative' }}>
          {/* Vertical timeline line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE }}
            style={{
              position: 'absolute', left: 19, top: 20, bottom: 20, width: 2,
              background: 'linear-gradient(180deg, var(--accent), var(--purple), var(--blue))',
              transformOrigin: 'top', borderRadius: 2, opacity: 0.35,
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
            {companies.map((exp, companyIdx) => {
              const featured = exp.projects.filter(p => p.featured)
              const others   = exp.projects.filter(p => !p.featured)
              return (
                <div key={exp.company} className="exp-timeline" style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
                  {/* Timeline node */}
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + companyIdx * 0.1, type: 'spring', stiffness: 260, damping: 20 }}
                      style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'var(--bg-card)',
                        border: '2px solid var(--accent)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700,
                        color: 'var(--accent)',
                        boxShadow: '0 0 0 4px var(--bg), 0 0 0 5px var(--border)',
                        zIndex: 1,
                      }}
                    >
                      {exp.company.charAt(0)}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Company header */}
                    <motion.div
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + companyIdx * 0.1, duration: 0.5, ease: EASE }}
                      style={{ marginBottom: 28 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
                        {exp.website ? (
                          <a href={exp.website} target="_blank" rel="noopener noreferrer" style={{
                            fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700,
                            color: 'var(--text)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
                          }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--accent)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text)'}
                          >
                            {exp.company}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.4, flexShrink: 0 }}>
                              <path d="M7 17L17 7M7 7h10v10" />
                            </svg>
                          </a>
                        ) : (
                          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>
                            {exp.company}
                          </span>
                        )}
                        <span style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 600 }}>{exp.role}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: exp.client ? 10 : 0 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                          {exp.period}
                        </span>
                      </div>
                      {exp.client && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
                            color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em',
                          }}>
                            Client
                          </span>
                          <span style={{ color: 'var(--border)', fontSize: 14 }}>→</span>
                          {exp.clientWebsite ? (
                            <a href={exp.clientWebsite} target="_blank" rel="noopener noreferrer" style={{
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                              padding: '3px 10px', borderRadius: 100,
                              background: 'rgba(255,101,53,0.1)',
                              border: '1px solid rgba(255,101,53,0.3)',
                              fontSize: 12, fontWeight: 600, color: 'var(--accent)',
                              fontFamily: 'var(--font-heading)', textDecoration: 'none',
                            }}>
                              <span style={{
                                width: 5, height: 5, borderRadius: '50%',
                                background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)',
                                animation: 'blink 2s ease-in-out infinite', flexShrink: 0,
                              }} />
                              {exp.client}
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.5 }}>
                                <path d="M7 17L17 7M7 7h10v10" />
                              </svg>
                            </a>
                          ) : (
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                              padding: '3px 10px', borderRadius: 100,
                              background: 'rgba(255,101,53,0.1)',
                              border: '1px solid rgba(255,101,53,0.3)',
                              fontSize: 12, fontWeight: 600, color: 'var(--accent)',
                              fontFamily: 'var(--font-heading)',
                            }}>
                              <span style={{
                                width: 5, height: 5, borderRadius: '50%',
                                background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)',
                                animation: 'blink 2s ease-in-out infinite', flexShrink: 0,
                              }} />
                              {exp.client}
                            </span>
                          )}
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            — full-time on-site, entire tenure
                          </span>
                        </div>
                      )}
                    </motion.div>

                    {featured.map(p => <FeaturedCard key={p.id} project={p} />)}

                    {others.length > 0 && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: 12, marginTop: featured.length > 0 ? 4 : 0,
                      }}>
                        {others.map((p, i) => (
                          <SmallCard key={p.id} project={p} delay={i * 0.07} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @media (max-width: 700px) {
          .featured-card-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .exp-timeline { gap: 16px !important; }
        }
      `}</style>
    </section>
  )
}
