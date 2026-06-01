import { EASE } from '../utils/motion'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { PersonalProject } from '../types'
import { TechBadge } from './TechIcon'
import LinkButtons from './LinkButtons'

interface Props { project: PersonalProject; index?: number }

export default function ProjectCard({ project, index = 0 }: Props) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: EASE }}
      whileHover={{ y: -4 }}
      style={{ height: '100%' }}
    >
      <div
        style={{
          display: 'flex', flexDirection: 'column',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '22px 24px',
          position: 'relative', overflow: 'hidden',
          height: '100%',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-card)',
          transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        }}
        onClick={() => navigate(`/project/${project.id}`)}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = `${project.color}50`
          ;(e.currentTarget as HTMLElement).style.boxShadow = `0 16px 48px ${project.color}18`
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
          ;(e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)'
        }}
      >
        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${project.color}, transparent)`,
        }} />

        {/* Header row: icon + type badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: `${project.color}14`, border: `1px solid ${project.color}28`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: project.color, opacity: 0.75 }} />
          </div>
          <span style={{
            padding: '2px 8px', borderRadius: 100, fontSize: 10,
            background: `${project.color}10`, color: project.color,
            border: `1px solid ${project.color}22`,
            fontFamily: 'var(--font-mono)', fontWeight: 500,
            maxWidth: 160, textAlign: 'right',
          }}>
            {project.type}
          </span>
        </div>

        <div style={{
          fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700,
          color: 'var(--text)', marginBottom: 6,
        }}>
          {project.name}
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 12 }}>
          {project.summary}
        </p>

        {/* Highlight pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: 100, alignSelf: 'flex-start',
          background: `${project.color}10`, border: `1px solid ${project.color}22`,
          marginBottom: 14,
        }}>
          <span style={{
            fontSize: 10.5, color: project.color, fontWeight: 600,
            fontFamily: 'var(--font-mono)',
          }}>
            ✦ {project.highlight}
          </span>
        </div>

        {/* Key features */}
        {project.features.length > 0 && (
          <div style={{ flex: 1, marginBottom: 14 }}>
            <div style={{
              fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 7, fontWeight: 500,
            }}>
              Key Features
            </div>
            {project.features.slice(0, 3).map(f => (
              <div key={f} style={{
                fontSize: 12, color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'flex-start', gap: 5, marginBottom: 4,
                lineHeight: 1.45,
              }}>
                <span style={{ color: project.color, fontSize: 7, marginTop: 3, flexShrink: 0 }}>▸</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tech stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {project.tech.slice(0, 4).map(t => <TechBadge key={t} tech={t} />)}
          {project.tech.length > 4 && <span className="tag">+{project.tech.length - 4}</span>}
        </div>

        {/* Action buttons */}
        <LinkButtons links={project.links} color={project.color} onNavigate={() => navigate(`/project/${project.id}`)} />
      </div>
    </motion.div>
  )
}
