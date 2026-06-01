import { EASE } from '../utils/motion'
import { motion } from 'framer-motion'
import TechIcon, { TECH_MAP } from './TechIcon'

interface Props {
  skills: Record<string, string[]>
  aiTools: string[]
}

const CATEGORY_COLORS: Record<string, string> = {
  Mobile:         '#6b8aff',
  Frontend:       '#ff6535',
  Backend:        '#4ade80',
  Databases:      '#fbbf24',
  'Tools & Infra':'#c084fc',
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}
const item = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

export default function Skills({ skills, aiTools }: Props) {
  return (
    <section id="skills" className="section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="container">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <span className="section-label">Skills</span>
          <h2 className="section-title">Tech I work with</h2>
          <p className="section-subtitle" style={{ marginBottom: 52 }}>
            Picked up most of this by shipping real products, not tutorials.
          </p>
        </motion.div>

        {/* ── Category skill cards ────────────────────────────────── */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: 14, marginBottom: 20,
          }}
        >
          {Object.entries(skills).map(([category, techs]) => {
            const color = CATEGORY_COLORS[category] || 'var(--accent)'
            return (
              <motion.div
                key={category}
                variants={item}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '22px',
                  cursor: 'default',
                  boxShadow: 'var(--shadow-card)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${color}40`
                  e.currentTarget.style.boxShadow = `0 8px 32px ${color}10`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-card)'
                }}
              >
                {/* Top accent gradient */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${color}80, transparent)`,
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: color, flexShrink: 0, display: 'block',
                    boxShadow: `0 0 6px ${color}80`,
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 500,
                    color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.09em',
                  }}>
                    {category}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {techs.map(tech => (
                    <motion.div
                      key={tech}
                      whileHover={{ scale: 1.08, y: -1 }}
                      transition={{ duration: 0.15 }}
                      title={tech}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '5px 10px', borderRadius: 100,
                        background: `${color}10`,
                        border: `1px solid ${color}24`,
                        fontSize: 12, fontWeight: 500, color: color,
                        cursor: 'default', whiteSpace: 'nowrap',
                        transition: 'background 0.15s ease, border-color 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = `${color}1e`
                        e.currentTarget.style.borderColor = `${color}45`
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = `${color}10`
                        e.currentTarget.style.borderColor = `${color}24`
                      }}
                    >
                      {TECH_MAP[tech]?.Icon
                        ? <TechIcon tech={tech} size={13} />
                        : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700, opacity: 0.7 }}>
                            {TECH_MAP[tech]?.label || tech.slice(0,2).toUpperCase()}
                          </span>
                      }
                      {tech}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* ── AI tools strip ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '18px 24px',
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.09em', flexShrink: 0,
          }}>
            AI tools I use daily
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {aiTools.map((tool, i) => (
              <motion.span
                key={tool}
                initial={{ opacity: 0, scale: 0.88 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i }}
                whileHover={{ scale: 1.07, y: -1 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', borderRadius: 100,
                  fontSize: 12, fontWeight: 500,
                  background: 'rgba(192,132,252,0.08)', color: 'var(--purple)',
                  border: '1px solid rgba(192,132,252,0.22)',
                  cursor: 'default',
                }}
              >
                <TechIcon tech={tool} size={13} />
                {tool}
              </motion.span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
