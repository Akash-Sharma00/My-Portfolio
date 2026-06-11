import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { PersonalProject } from '../types'
import { SectionHead } from '../components/Section'
import Tilt from '../components/Tilt'

const LINK_LABELS: Record<string, string> = {
  github: 'GitHub ↗',
  pubdev: 'pub.dev ↗',
  live: 'Live ↗',
}

export default function Lab({
  projects,
  learnings,
}: {
  projects: PersonalProject[]
  learnings: string[]
}) {
  const navigate = useNavigate()

  return (
    <section id="lab" className="section">
      <SectionHead
        kicker="05 · The Laboratory"
        title={
          <>
            Built after hours, <span className="text-aurora">for the love of it.</span>
          </>
        }
        sub="Open-source platforms, published packages, and experiments — the playground where new ideas get pressure-tested before they reach production. Open any card for the full story."
      />

      <div className="lab-grid">
        {projects.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Tilt max={6}>
              <article
                className="lab-card glass holo-border scanlines"
                style={{ ['--pc' as string]: p.color }}
                data-cursor="view"
                role="link"
                tabIndex={0}
                aria-label={`Open ${p.name} details`}
                onClick={() => navigate(`/project/${p.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    navigate(`/project/${p.id}`)
                  }
                }}
              >
                {p.screenshots && p.screenshots.length > 0 && (
                  <div className="lc-shot">
                    <img src={p.screenshots[0]} alt={`${p.name} preview`} loading="lazy" />
                    <span className="lc-shot-count">◉ {p.screenshots.length} shots</span>
                  </div>
                )}
                <span className="lc-cat">{p.type}</span>
                <h4>{p.name}</h4>
                <p>{p.summary}</p>
                <span className="lc-highlight">{p.highlight}</span>
                <div className="ac-tech">
                  {p.tech.slice(0, 5).map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <div className="lc-links">
                  {Object.entries(p.links)
                    .filter(([, url]) => url && url !== '#')
                    .map(([kind, url], li) => (
                      <a
                        key={kind}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="link-btn"
                        data-cursor="link"
                        style={{ ['--d' as string]: `${li * 0.45}s` }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {LINK_LABELS[kind] ?? `${kind} ↗`}
                      </a>
                    ))}
                </div>
                <span className="lc-open">
                  Open case file <span className="arrow">→</span>
                </span>
              </article>
            </Tilt>
          </motion.div>
        ))}
      </div>

      <div className="vault">
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Knowledge vault — <span className="text-aurora">hard-won lessons</span>
        </motion.h3>
        <div className="vault-chips">
          {learnings.map((l, i) => (
            <motion.span
              key={l}
              className="chip"
              initial={{ opacity: 0, scale: 0.8, y: 16 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              ◈ {l}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  )
}
