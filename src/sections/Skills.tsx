import { lazy, Suspense, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import type { PortfolioData } from '../types'
import { SectionHead } from '../components/Section'
import { usePrefersReducedMotion } from '../hooks/useMedia'
import { SKILL_ICONS } from '../lib/skillIcons'
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
  const ReadingIcon = reading ? SKILL_ICONS[reading.skill] : null

  return (
    <section id="skills" className="section" ref={ref}>
      <SectionHead
        kicker="02 · The Arsenal"
        title={
          <>
            A galaxy of <span className="text-aurora">technologies.</span>
          </>
        }
        sub="Every orbit is a discipline. Drag to rotate the system, hover a cube to scan it, tap a category to isolate its ring."
      />

      <div className="galaxy-filters" role="tablist" aria-label="Skill categories">
        <button
          className={`cat-chip${active === null ? ' active' : ''}`}
          data-cursor="link"
          onClick={() => setActive(null)}
        >
          <span className="dot" style={{ background: 'var(--ink)', boxShadow: '0 0 10px var(--ink)' }} />
          All systems
          <span className="count">{String(categories.reduce((n, c) => n + c.skills.length, 0)).padStart(2, '0')}</span>
        </button>
        {categories.map((c) => (
          <button
            key={c.name}
            className={`cat-chip${active === c.name ? ' active' : ''}`}
            data-cursor="link"
            style={{ ['--cc' as string]: c.color }}
            onClick={() => setActive(active === c.name ? null : c.name)}
          >
            <span className="dot" style={{ background: c.color, boxShadow: `0 0 10px ${c.color}` }} />
            {c.name}
            <span className="count">{String(c.skills.length).padStart(2, '0')}</span>
          </button>
        ))}
      </div>

      {!reduced ? (
        <div className="galaxy-canvas galaxy-full" data-cursor="link">
          {inView && (
            <Suspense fallback={null}>
              <SkillsGalaxy
                categories={categories}
                activeCategory={active}
                onSelect={(sel) => setFocus(sel)}
                onHover={setHovered}
              />
            </Suspense>
          )}

          <div className="galaxy-readout-float glass">
            <AnimatePresence mode="wait">
              {reading ? (
                <motion.div
                  key={reading.skill}
                  className="ro-row"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {ReadingIcon && (
                    <span className="ro-icon" style={{ color: reading.color, borderColor: `${reading.color}66` }}>
                      <ReadingIcon size={22} />
                    </span>
                  )}
                  <span>
                    <span className="ro-name" style={{ color: reading.color }}>
                      {reading.skill}
                    </span>
                    <span className="ro-cat">ORBIT · {reading.category.toUpperCase()}</span>
                  </span>
                </motion.div>
              ) : (
                <motion.p
                  key="hint"
                  className="ro-hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Hover a cube to scan it — production experience across mobile, web, backend, and AI tooling.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <span className="galaxy-hud">
            SYS · {categories.reduce((n, c) => n + c.skills.length, 0)} NODES / {categories.length} ORBITS
          </span>
        </div>
      ) : (
        <div className="galaxy-static">
          {categories
            .filter((c) => active === null || c.name === active)
            .map((c) => (
              <div key={c.name} className="galaxy-static-group">
                <h4 style={{ color: c.color }}>{c.name}</h4>
                <div className="galaxy-static-chips">
                  {c.skills.map((s) => {
                    const Icon = SKILL_ICONS[s]
                    return (
                      <span key={s} className="chip" style={{ borderColor: `${c.color}55` }}>
                        {Icon && <Icon size={14} style={{ color: c.color }} />}
                        {s}
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}
        </div>
      )}
    </section>
  )
}
