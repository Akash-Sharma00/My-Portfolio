import { useRef } from 'react'
import { EASE } from '../utils/motion'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion'
import TechIcon, { TECH_MAP } from './TechIcon'

interface Props {
  skills: Record<string, string[]>
  aiTools: string[]
}

const CATEGORY_COLORS: Record<string, string> = {
  Mobile:          '#6b8aff',
  Frontend:        '#ff6535',
  Backend:         '#4ade80',
  Databases:       '#fbbf24',
  'Tools & Infra': '#c084fc',
  IDEs:            '#38bdf8',
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

/* ── A single interactive, 3D-tilting category card ───────────────── */
function CategoryCard({
  category, techs, color, index,
}: { category: string; techs: string[]; color: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)

  // Raw pointer position (0–1) inside the card
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  // Smooth the tilt so it feels weighty, not twitchy
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 200, damping: 18 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-7, 7]), { stiffness: 200, damping: 18 })

  // Spotlight glow follows the cursor
  const glowX = useTransform(px, v => `${v * 100}%`)
  const glowY = useTransform(py, v => `${v * 100}%`)
  const glow = useMotionTemplate`radial-gradient(220px circle at ${glowX} ${glowY}, ${color}1f, transparent 70%)`

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  function handleLeave() {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      variants={item}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          rotateX, rotateY,
          transformStyle: 'preserve-3d',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '22px',
          height: '100%',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        }}
        whileHover={{ boxShadow: `0 18px 50px ${color}1a`, borderColor: `${color}3a` }}
      >
        {/* Cursor spotlight */}
        <motion.div
          style={{
            position: 'absolute', inset: 0, background: glow,
            pointerEvents: 'none', opacity: 0.9,
          }}
        />

        {/* Top accent gradient */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${color}, transparent)`,
        }} />

        {/* Big ghost index number, parallaxed forward */}
        <span style={{
          position: 'absolute', top: 12, right: 16,
          fontFamily: 'var(--font-mono)', fontSize: 30, fontWeight: 700,
          color: color, opacity: 0.1, lineHeight: 1,
          transform: 'translateZ(30px)', pointerEvents: 'none',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
          transform: 'translateZ(45px)',
        }}>
          <motion.span
            animate={{ boxShadow: [`0 0 4px ${color}80`, `0 0 10px ${color}`, `0 0 4px ${color}80`] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 8, height: 8, borderRadius: '50%',
              background: color, flexShrink: 0, display: 'block',
            }}
          />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 500,
            color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.09em',
          }}>
            {category}
          </span>
        </div>

        {/* Skill chips */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 7,
          transform: 'translateZ(35px)',
        }}>
          {techs.map((tech, i) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.04 * i, duration: 0.3, ease: EASE }}
              whileHover={{ scale: 1.08, y: -2 }}
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
                e.currentTarget.style.background = `${color}24`
                e.currentTarget.style.borderColor = `${color}55`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = `${color}10`
                e.currentTarget.style.borderColor = `${color}24`
              }}
            >
              {TECH_MAP[tech]?.Icon
                ? <TechIcon tech={tech} size={13} />
                : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700, opacity: 0.7 }}>
                    {TECH_MAP[tech]?.label || tech.slice(0, 2).toUpperCase()}
                  </span>
              }
              {tech}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Skills({ skills, aiTools }: Props) {
  const entries = Object.entries(skills)
  const totalTechs = entries.reduce((n, [, t]) => n + t.length, 0)

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
          <p className="section-subtitle" style={{ marginBottom: 18 }}>
            Picked up most of this by shipping real products, not tutorials.
          </p>

          {/* Quick stat line — a little flex for recruiters */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
            marginBottom: 44, fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--text-muted)',
          }}>
            <span><strong style={{ color: 'var(--accent)' }}>{totalTechs}+</strong> technologies</span>
            <span style={{ opacity: 0.3 }}>•</span>
            <span><strong style={{ color: 'var(--accent)' }}>{entries.length}</strong> domains</span>
            <span style={{ opacity: 0.3 }}>•</span>
            <span><strong style={{ color: 'var(--accent)' }}>3.9</strong> yrs shipping</span>
          </div>
        </motion.div>

        {/* ── Interactive category cards ──────────────────────────── */}
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
          {entries.map(([category, techs], i) => (
            <CategoryCard
              key={category}
              category={category}
              techs={techs}
              color={CATEGORY_COLORS[category] || 'var(--accent)'}
              index={i}
            />
          ))}
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
