import { motion } from 'framer-motion'
import type { Personal } from '../types'
import { EASE } from '../utils/motion'
import TechIcon from './TechIcon'
import { TECH_MAP } from './TechIcon'

interface Props { data: Personal }

interface FloatCard {
  tech: string
  top?: number
  bottom?: number
  left?: number
  right?: number
  floatOffset: number
  floatDur: number
  delay: number
}

const FLOAT_CARDS: FloatCard[] = [
  { tech: 'Flutter',    top: -30,   left: 124,  floatOffset: -12, floatDur: 5.5, delay: 0    },
  { tech: 'React',      top: 24,    right: -40, floatOffset: -10, floatDur: 6.5, delay: 0.8  },
  { tech: 'Node.js',   bottom: 24,  right: -40, floatOffset: -8,  floatDur: 5.0, delay: 1.5  },
  { tech: 'TypeScript', bottom: -30, left: 124,  floatOffset: -12, floatDur: 7.0, delay: 0.4  },
  { tech: 'Python',    top: 24,    left: -40,  floatOffset: -10, floatDur: 6.0, delay: 2.0  },
  { tech: 'Docker',    bottom: 24,  left: -40,  floatOffset: -8,  floatDur: 5.8, delay: 1.2  },
]

export default function Hero({ data }: Props) {
  return (
    <section style={{
      minHeight: '100svh',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      paddingTop: 'calc(var(--nav-height) + 40px)',
      paddingBottom: 80,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
        backgroundSize: '64px 64px',
      }} />

      {/* Primary glow blob — top left */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          position: 'absolute', top: '10%', left: '-8%', width: '55%', height: '65%',
          background: 'radial-gradient(ellipse, var(--accent-glow) 0%, transparent 65%)',
          zIndex: 0, pointerEvents: 'none',
        }}
      />

      {/* Secondary glow blob — bottom right */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.3 }}
        style={{
          position: 'absolute', bottom: '5%', right: '-5%', width: '40%', height: '50%',
          background: 'radial-gradient(ellipse, rgba(107,138,255,0.08) 0%, transparent 65%)',
          zIndex: 0, pointerEvents: 'none',
        }}
      />

      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: 64, justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 0', minWidth: 0 }}>

            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}
            >
              <span style={{
                display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                background: 'var(--green)', boxShadow: '0 0 10px var(--green)',
                animation: 'blink 2s ease-in-out infinite',
              }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                {data.status}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              style={{
                fontSize: 'clamp(52px, 9vw, 96px)',
                fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 0.95, marginBottom: 24,
              }}
            >
              {data.name.split(' ')[0]}
              <br />
              <span style={{ color: 'var(--text-muted)' }}>{data.name.split(' ')[1]}</span>
            </motion.h1>

            {/* Role + specialisations */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}
            >
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(16px, 2.2vw, 20px)', fontWeight: 500, color: 'var(--text-secondary)' }}>
                {data.title}
              </span>
              <span style={{ color: 'var(--border)', fontSize: 24 }}>·</span>
              {data.specializations.map((s, i) => (
                <span key={i} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 500,
                  color: i === 0 ? 'var(--accent)' : 'var(--text-muted)',
                }}>
                  {s}{i < data.specializations.length - 1 && <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>·</span>}
                </span>
              ))}
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
              style={{ fontSize: 'clamp(15px, 1.8vw, 17px)', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 560, marginBottom: 40 }}
            >
              {data.about}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 60 }}
            >
              <a href="#projects" className="btn btn-primary">
                View my work
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
              <a href="mailto:akashvsh13@gmail.com" className="btn btn-ghost">Get in touch</a>
            </motion.div>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
              style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 1, background: 'var(--border)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                overflow: 'hidden', maxWidth: 560,
              }}
            >
              {data.stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.68 + i * 0.08, ease: EASE }}
                  style={{ background: 'var(--bg-card)', padding: '20px 16px', textAlign: 'center' }}
                >
                  <div style={{
                    fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 3vw, 30px)',
                    fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.03em',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--text-muted)',
                    marginTop: 4, lineHeight: 1.4, textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9, ease: EASE }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 24 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                {data.location}
              </span>
            </motion.div>
          </div>

          {/* Profile photo + floating tech cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            className="hero-photo-wrap"
            style={{ flexShrink: 0 }}
          >
            <div style={{
              position: 'relative', width: 300, height: 300,
              overflow: 'visible',
            }}>
              {/* Spinning ring */}
              <div style={{
                position: 'absolute', inset: -2, borderRadius: '50%',
                background: 'conic-gradient(var(--accent) 0deg, transparent 120deg, var(--accent) 240deg, transparent 360deg)',
                animation: 'spin 8s linear infinite',
              }} />
              {/* Inner bg mask */}
              <div style={{
                position: 'absolute', inset: 3, borderRadius: '50%',
                background: 'var(--bg)',
              }} />
              {/* Photo */}
              <img
                src="/images/my-pic.png"
                alt="Akash Sharma"
                style={{
                  position: 'absolute', inset: 6,
                  width: 'calc(100% - 12px)', height: 'calc(100% - 12px)',
                  borderRadius: '50%', objectFit: 'cover', objectPosition: 'top',
                  zIndex: 1,
                }}
              />

              {/* Floating tech cards */}
              {FLOAT_CARDS.map((card, i) => {
                const def = TECH_MAP[card.tech] || { color: '#888888' }
                const color = def.color
                return (
                  <motion.div
                    key={card.tech}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + i * 0.12, ease: EASE }}
                    style={{
                      position: 'absolute',
                      top: card.top,
                      bottom: card.bottom,
                      left: card.left,
                      right: card.right,
                      zIndex: 3,
                      pointerEvents: 'none',
                    }}
                  >
                    <motion.div
                      animate={{ y: [0, card.floatOffset, 0] }}
                      transition={{
                        duration: card.floatDur,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: card.delay * 0.5,
                      }}
                      style={{
                        width: 52, height: 52,
                        borderRadius: 14,
                        background: `${color}12`,
                        border: `1px solid ${color}35`,
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 4px 20px ${color}20, inset 0 1px 0 ${color}15`,
                        transform: `perspective(300px) rotateX(${i % 2 === 0 ? 8 : -8}deg) rotateY(${i % 3 === 0 ? 10 : -10}deg)`,
                      }}
                    >
                      <TechIcon tech={card.tech} size={26} />
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          pointerEvents: 'none',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
          letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>
          scroll
        </span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="var(--text-muted)" strokeWidth="2"
          style={{ animation: 'scrollBounce 1.8s ease-in-out infinite' }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin  { to { transform: rotate(360deg); } }
        @media(max-width:580px){ [data-stats] { grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:768px){ .hero-photo-wrap { display: none; } }
      `}</style>
    </section>
  )
}
