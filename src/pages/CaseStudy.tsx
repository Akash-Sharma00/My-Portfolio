import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import type { PortfolioData, Project } from '../types'
import { usePortfolioData } from '../hooks/usePortfolioData'
import { isMobileProject } from '../lib/projectUtils'

const EASE = [0.16, 1, 0.3, 1] as const

interface CaseModel extends Project {
  platforms: string[]
  next: { id: string; name: string; color: string } | null
}

const PLATFORM_LABELS: Record<string, string> = {
  live: 'Web',
  playstore: 'Android',
  appstore: 'iOS',
  github: 'Open Source',
  pubdev: 'pub.dev',
}

const LINK_LABELS: Record<string, string> = {
  live: 'Open live platform',
  playstore: 'Get it on Play Store',
  appstore: 'Get it on App Store',
  github: 'View source on GitHub',
  pubdev: 'View on pub.dev',
}

function buildModel(data: PortfolioData, id: string): CaseModel | null {
  const work = data.workExperience.flatMap((exp) => exp.projects)
  const personal: Project[] = data.personalProjects.map((p) => ({
    ...p,
    company: 'Personal Project',
    impact: p.highlight,
    impactDetail: p.type,
    featured: false,
  }))
  const all = [...work, ...personal]
  const idx = all.findIndex((p) => p.id === id)
  if (idx === -1) return null

  const project = all[idx]
  const next = all[(idx + 1) % all.length]
  return {
    ...project,
    platforms: Object.entries(project.links)
      .filter(([, url]) => url && url !== '#')
      .map(([kind]) => PLATFORM_LABELS[kind] ?? kind),
    next: next ? { id: next.id, name: next.name, color: next.color } : null,
  }
}

function Chapter({
  index,
  label,
  title,
  children,
}: {
  index: string
  label: string
  title: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      className="case-section"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <span className="cs-label">
        {index} · {label}
      </span>
      <h2>{title}</h2>
      {children}
    </motion.div>
  )
}

export default function CaseStudy() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data } = usePortfolioData()
  const [lightbox, setLightbox] = useState<number | null>(null)

  const model = useMemo(() => (data && id ? buildModel(data, id) : null), [data, id])

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })

  const shots = model?.screenshots ?? []
  const captions = model?.screenshotCaptions ?? []
  const portrait = model ? isMobileProject(model) : false

  const step = useCallback(
    (dir: 1 | -1) => {
      setLightbox((cur) => (cur === null ? cur : (cur + dir + shots.length) % shots.length))
    },
    [shots.length],
  )

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, step])

  if (data && !model) {
    navigate('/', { replace: true })
    return null
  }
  if (!model) return null

  const paragraphs = model.description.split('\n').filter((p) => p.trim().length > 0)
  const links = Object.entries(model.links).filter(([, url]) => url && url !== '#')

  return (
    <main style={{ ['--pc' as string]: model.color }}>
      <motion.div
        className="scroll-progress"
        style={{ scaleX: progress, background: `linear-gradient(90deg, ${model.color}, #4cd9ed)` }}
      />

      <header className="case-hero">
        <Link to="/" className="case-back" data-cursor="link">
          ← BACK TO UNIVERSE
        </Link>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 75% 15%, ${model.color}22, transparent 55%)`,
            pointerEvents: 'none',
          }}
        />
        <motion.span
          className="case-type"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          {model.type} · {model.company}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.2, ease: EASE }}
        >
          {model.name}
        </motion.h1>
        <motion.p
          className="case-summary"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
        >
          {model.summary}
        </motion.p>
        <motion.div
          className="case-facts"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.7 }}
        >
          <div>
            <b>{model.company}</b>
            ORGANISATION
          </div>
          <div>
            <b>{model.platforms.length > 0 ? model.platforms.join(' · ') : 'Internal'}</b>
            PLATFORMS
          </div>
          <div>
            <b>{model.tech.slice(0, 3).join(' · ')}</b>
            CORE STACK
          </div>
        </motion.div>
      </header>

      <Chapter index="01" label="Briefing" title="What this is, and why it exists">
        <div className="case-prose">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Chapter>

      <div className="case-impact-band">
        <motion.div
          className="case-impact-inner glass scanlines"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ boxShadow: `0 0 90px -30px ${model.color}88 inset` }}
        >
          <div className="imp-value text-aurora">{model.impact}</div>
          {model.impactDetail && <div className="imp-detail">{model.impactDetail}</div>}
        </motion.div>
      </div>

      <Chapter index="02" label="Capabilities" title="What it does">
        <div className="feature-grid">
          {model.features.map((f, i) => (
            <motion.div
              key={f}
              className="feature-cell glass"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.07, ease: EASE }}
            >
              <span className="fc-index">{String(i + 1).padStart(2, '0')}</span>
              {f}
            </motion.div>
          ))}
        </div>
      </Chapter>

      <Chapter index="03" label="Engineering" title="The stack behind it">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 28 }}>
          {model.tech.map((t, i) => (
            <motion.span
              key={t}
              className="chip"
              style={{ fontSize: 14, padding: '11px 20px', borderColor: `${model.color}55` }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
            >
              {t}
            </motion.span>
          ))}
        </div>
      </Chapter>

      {shots.length > 0 && (
        <Chapter index="04" label="Visual Records" title="Inside the product">
          <div className="shot-rail">
            {shots.map((src, i) => (
              <figure key={src} className={portrait ? 'is-portrait' : ''}>
                <img
                  src={src}
                  alt={captions[i] ?? `${model.name} screenshot ${i + 1}`}
                  loading="lazy"
                  data-cursor="view"
                  onClick={() => setLightbox(i)}
                />
                {captions[i] && <figcaption>{captions[i]}</figcaption>}
              </figure>
            ))}
          </div>
        </Chapter>
      )}

      {links.length > 0 && (
        <Chapter index={shots.length > 0 ? '05' : '04'} label="Deployment" title="See it in the wild">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 28 }}>
            {links.map(([kind, url]) => (
              <a key={kind} href={url} target="_blank" rel="noreferrer" className="btn btn-ghost" data-cursor="link">
                <span className="btn-sheen" />
                {LINK_LABELS[kind] ?? `Open ${kind}`} ↗
              </a>
            ))}
          </div>
        </Chapter>
      )}

      {model.next && (
        <Link to={`/project/${model.next.id}`} className="case-next" data-cursor="view">
          <motion.div
            className="case-next-inner glass holo-border"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: EASE }}
            style={{ boxShadow: `0 0 110px -40px ${model.next.color}66 inset` }}
          >
            <span className="cn-label">Next exhibit</span>
            <div className="cn-name text-aurora">{model.next.name} →</div>
          </motion.div>
        </Link>
      )}

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              key={lightbox}
              src={shots[lightbox]}
              alt={captions[lightbox] ?? `${model.name} screenshot`}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            />
            {captions[lightbox] && <span className="lb-caption">{captions[lightbox]}</span>}
            {shots.length > 1 && (
              <>
                <button
                  className="lb-nav lb-prev"
                  onClick={(e) => {
                    e.stopPropagation()
                    step(-1)
                  }}
                >
                  ←
                </button>
                <button
                  className="lb-nav lb-next"
                  onClick={(e) => {
                    e.stopPropagation()
                    step(1)
                  }}
                >
                  →
                </button>
              </>
            )}
            <button className="lb-close" onClick={() => setLightbox(null)}>
              ESC · CLOSE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
