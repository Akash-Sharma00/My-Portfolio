import { EASE } from '../utils/motion'
import { motion } from 'framer-motion'
import type { PersonalProject, Contribution } from '../types'
import ProjectCard from './ProjectCard'

interface Props {
  projects: PersonalProject[]
  contributions: Contribution[]
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
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '13px 18px',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginRight: 10 }}>{c.name}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.description}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                    {c.links.playstore && (
                      <a href={c.links.playstore} style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} onClick={e => e.stopPropagation()}>Play Store</a>
                    )}
                    {c.links.appstore && (
                      <a href={c.links.appstore} style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} onClick={e => e.stopPropagation()}>App Store</a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
