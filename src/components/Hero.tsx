import { motion } from 'framer-motion'
import type { Personal } from '../types'
import { EASE } from '../utils/motion'

interface Props { data: Personal }

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
      {/* Glow blob */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          position: 'absolute', top: '15%', left: '-5%', width: '55%', height: '60%',
          background: 'radial-gradient(ellipse, var(--accent-glow) 0%, transparent 65%)',
          zIndex: 0, pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 64, justifyContent: 'space-between' }}>
        <div style={{ flex: '1 1 0', minWidth: 0 }}>

          {/* Status */}
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

        {/* Profile photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="hero-photo-wrap"
          style={{ flexShrink: 0 }}
        >
          <div style={{
            position: 'relative', width: 300, height: 300,
          }}>
            <div style={{
              position: 'absolute', inset: -2, borderRadius: '50%',
              background: 'conic-gradient(var(--accent) 0deg, transparent 120deg, var(--accent) 240deg, transparent 360deg)',
              animation: 'spin 8s linear infinite',
            }} />
            <div style={{
              position: 'absolute', inset: 3, borderRadius: '50%',
              background: 'var(--bg)',
            }} />
            <img
              src="/images/my-pic.png"
              alt="Akash Sharma"
              style={{
                position: 'absolute', inset: 6, width: 'calc(100% - 12px)', height: 'calc(100% - 12px)',
                borderRadius: '50%', objectFit: 'cover', objectPosition: 'top',
              }}
            />
          </div>
        </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media(max-width:580px){ [data-stats] { grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:768px){ .hero-photo-wrap { display: none; } }
      `}</style>
    </section>
  )
}
