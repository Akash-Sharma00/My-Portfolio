import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

interface Props { color: string }

export default function PageBg({ color }: Props) {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  // All alpha hex suffixes and opacity values scale up in light mode
  const α = {
    dot:      dark ? '22' : '50',
    topGlow:  dark ? '70' : 'cc',
    blob1:    dark ? '18' : '38',
    blob2:    dark ? '12' : '2c',
    blob3:    dark ? '0b' : '22',
    arc:      dark ? 0.11 : 0.25,
    r1:       dark ? [0.06, 0.13, 0.06] as number[] : [0.18, 0.32, 0.18] as number[],
    r2:       dark ? [0.05, 0.10, 0.05] as number[] : [0.14, 0.26, 0.14] as number[],
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle, ${color}${α.dot} 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
      }} />

      {/* Top edge glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${color}${α.topGlow} 50%, transparent)`,
      }} />

      {/* Aurora blob — top left */}
      <motion.div
        animate={{ x: [0, 70, -35, 0], y: [0, -45, 35, 0], scale: [1, 1.18, 0.88, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '-20%', left: '-15%',
          width: '70%', height: '70%',
          background: `radial-gradient(ellipse, ${color}${α.blob1} 0%, transparent 65%)`,
          filter: 'blur(60px)',
        }}
      />

      {/* Aurora blob — bottom right */}
      <motion.div
        animate={{ x: [0, -55, 30, 0], y: [0, 45, -50, 0], scale: [1, 0.86, 1.14, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
        style={{
          position: 'absolute', bottom: '-20%', right: '-15%',
          width: '65%', height: '65%',
          background: `radial-gradient(ellipse, ${color}${α.blob2} 0%, transparent 65%)`,
          filter: 'blur(70px)',
        }}
      />

      {/* Aurora blob — mid */}
      <motion.div
        animate={{ x: [0, 35, -20, 0], y: [0, -28, 22, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        style={{
          position: 'absolute', top: '30%', right: '18%',
          width: '45%', height: '45%',
          background: `radial-gradient(ellipse, ${color}${α.blob3} 0%, transparent 65%)`,
          filter: 'blur(80px)',
        }}
      />

      {/* Concentric arcs — top right */}
      <svg style={{ position: 'absolute', top: 0, right: 0 }} width="280" height="280" viewBox="0 0 280 280">
        {[50, 90, 130, 170, 210, 255].map(r => (
          <circle key={r} cx="280" cy="0" r={r} fill="none" stroke={color} strokeWidth="0.7" opacity={α.arc} />
        ))}
      </svg>

      {/* Concentric arcs — bottom left */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0 }} width="280" height="280" viewBox="0 0 280 280">
        {[50, 90, 130, 170, 210, 255].map(r => (
          <circle key={r} cx="0" cy="280" r={r} fill="none" stroke={color} strokeWidth="0.7" opacity={α.arc} />
        ))}
      </svg>

      {/* Floating reticle — drifts slowly */}
      <motion.div
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], opacity: α.r1 }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{ position: 'absolute', top: '55%', left: '8%' }}
      >
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="28" stroke={color} strokeWidth="0.8" strokeDasharray="4 8" />
          <circle cx="32" cy="32" r="4" stroke={color} strokeWidth="0.8" />
          <line x1="32" y1="0" x2="32" y2="18" stroke={color} strokeWidth="0.8" />
          <line x1="32" y1="46" x2="32" y2="64" stroke={color} strokeWidth="0.8" />
          <line x1="0" y1="32" x2="18" y2="32" stroke={color} strokeWidth="0.8" />
          <line x1="46" y1="32" x2="64" y2="32" stroke={color} strokeWidth="0.8" />
        </svg>
      </motion.div>

      {/* Floating reticle 2 */}
      <motion.div
        animate={{ x: [0, -30, 15, 0], y: [0, 20, -15, 0], opacity: α.r2 }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
        style={{ position: 'absolute', top: '20%', right: '12%' }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="4" y="4" width="32" height="32" rx="6" stroke={color} strokeWidth="0.8" strokeDasharray="3 6" />
          <circle cx="20" cy="20" r="3" stroke={color} strokeWidth="0.8" />
        </svg>
      </motion.div>
    </div>
  )
}
