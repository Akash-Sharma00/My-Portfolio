import { EASE } from '../utils/motion'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { PersonalProject } from '../types'
import { TechBadge } from './TechIcon'
import LinkButtons from './LinkButtons'

interface Props { project: PersonalProject; index?: number }

function CategoryIcon({ category, color }: { category: string; color: string }) {
  const s = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

  switch (category) {
    case 'Website':
      return (
        <svg {...s}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    case 'Mobile App':
      return (
        <svg {...s}>
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <circle cx="12" cy="17.5" r="0.8" fill={color} stroke="none" />
          <line x1="8" y1="6" x2="16" y2="6" strokeOpacity="0.4" />
        </svg>
      )
    case 'Flutter Package':
      return (
        <svg {...s}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      )
    case 'RAG System':
      return (
        <svg {...s}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" />
          <line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" />
          <line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" />
          <line x1="20" y1="14" x2="23" y2="14" />
          <line x1="1" y1="9" x2="4" y2="9" />
          <line x1="1" y1="14" x2="4" y2="14" />
        </svg>
      )
    case 'App':
      return (
        <svg {...s}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      )
    default:
      return (
        <svg {...s}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      )
  }
}

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

        {/* Header row: category icon + type badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: `${project.color}14`, border: `1px solid ${project.color}28`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <CategoryIcon category={project.category ?? ''} color={project.color} />
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

        {/* Tech stack — single row, fade-clipped */}
        <div style={{
          marginBottom: 14, overflow: 'hidden',
          maskImage: 'linear-gradient(to right, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 80%, transparent 100%)',
        }}>
          <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 6, alignItems: 'center' }}>
            {project.tech.map(t => <TechBadge key={t} tech={t} />)}
          </div>
        </div>

        {/* Action buttons */}
        <LinkButtons links={project.links} color={project.color} onNavigate={() => navigate(`/project/${project.id}`)} />
      </div>
    </motion.div>
  )
}
