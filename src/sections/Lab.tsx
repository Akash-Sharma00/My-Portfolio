import { motion } from 'framer-motion'
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
  return (
    <section id="lab" className="section">
      <SectionHead
        kicker="05 · The Laboratory"
        title={
          <>
            Built after hours, <span className="text-aurora">for the love of it.</span>
          </>
        }
        sub="Open-source platforms, published packages, and experiments — the playground where new ideas get pressure-tested before they reach production."
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
              <article className="lab-card glass holo-border scanlines" style={{ ['--pc' as string]: p.color }}>
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
                    .map(([kind, url]) => (
                      <a
                        key={kind}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="chip"
                        data-cursor="link"
                      >
                        {LINK_LABELS[kind] ?? `${kind} ↗`}
                      </a>
                    ))}
                </div>
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
