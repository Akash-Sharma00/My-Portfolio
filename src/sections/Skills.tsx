import { lazy, Suspense, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import type { PortfolioData } from '../types'
import { SectionHead } from '../components/Section'
import { usePrefersReducedMotion } from '../hooks/useMedia'
import type { GalaxyCategory, GalaxySelection } from '../components/three/SkillsGalaxy'

const SkillsGalaxy = lazy(() => import('../components/three/SkillsGalaxy'))

const CATEGORY_COLORS: Record<string, string> = {
  Mobile: '#4cd9ed',
  Frontend: '#8b7bff',
  Backend: '#ff6535',
  Databases: '#4ade80',
  'Tools & Infra': '#fbbf24',
  IDEs: '#f472b6',
  'AI Arsenal': '#e879f9',
}

export default function Skills({ data }: { data: PortfolioData }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '500px 0px' })
  const reduced = usePrefersReducedMotion()

  const [active, setActive] = useState<string | null>(null)
  const [focus, setFocus] = useState<GalaxySelection | null>(null)
  const [hovered, setHovered] = useState<GalaxySelection | null>(null)

  const categories: GalaxyCategory[] = useMemo(() => {
    const cats = Object.entries(data.skills).map(([name, skills]) => ({
      name,
      skills,
      color: CATEGORY_COLORS[name] ?? '#8b7bff',
    }))
    cats.push({ name: 'AI Arsenal', skills: data.aiTools, color: CATEGORY_COLORS['AI Arsenal'] })
    return cats
  }, [data])

  const reading = hovered ?? focus

  return (
    <section id="skills" className="section" ref={ref}>
      <SectionHead
        kicker="02 · The Arsenal"
        title={
          <>
            A galaxy of <span className="text-aurora">technologies.</span>
          </>
        }
        sub="Every orbit is a discipline. Drag to rotate the system, hover a node to scan it, tap a category to isolate its ring."
      />

      <div className="galaxy-wrap">
        <div className="galaxy-canvas" data-cursor="link">
          {inView && !reduced && (
            <Suspense fallback={null}>
              <SkillsGalaxy
                categories={categories}
                activeCategory={active}
                onSelect={(sel) => setFocus(sel)}
                onHover={setHovered}
              />
            </Suspense>
          )}
          {reduced && (
            <div style={{ padding: 28, display: 'flex', flexWrap: 'wrap', gap: 10, alignContent: 'flex-start' }}>
              {categories.flatMap((c) =>
                c.skills.map((s) => (
                  <span key={c.name + s} className="chip" style={{ borderColor: `${c.color}55` }}>
                    {s}
                  </span>
                )),
              )}
            </div>
          )}
          <span className="galaxy-hud">SYS · {categories.reduce((n, c) => n + c.skills.length, 0)} NODES / {categories.length} ORBITS</span>
        </div>

        <div className="galaxy-panel glass scanlines">
          <span className="sys-label">Orbit Index</span>
          <h3>System map</h3>
          <div className="cat-list">
            {categories.map((c) => (
              <button
                key={c.name}
                className={`cat-row${active === c.name ? ' active' : ''}`}
                data-cursor="link"
                onClick={() => setActive(active === c.name ? null : c.name)}
              >
                <span className="dot" style={{ background: c.color, boxShadow: `0 0 10px ${c.color}` }} />
                <span className="name">{c.name}</span>
                <span className="count">{String(c.skills.length).padStart(2, '0')}</span>
              </button>
            ))}
          </div>

          <div className="galaxy-readout">
            <AnimatePresence mode="wait">
              {reading ? (
                <motion.div
                  key={reading.skill}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="ro-name" style={{ color: reading.color }}>
                    {reading.skill}
                  </div>
                  <div className="ro-cat" style={{ color: 'var(--ink-faint)' }}>
                    ORBIT · {reading.category.toUpperCase()}
                  </div>
                </motion.div>
              ) : (
                <motion.p
                  key="hint"
                  className="ro-hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Hover or tap a node in the galaxy to scan it. Production experience across the
                  full stack — mobile, web, backend, and AI tooling.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
