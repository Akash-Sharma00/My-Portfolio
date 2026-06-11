import { motion } from 'framer-motion'

/** Branded full-screen loading state — animated monogram + name + progress sweep. */
export default function Loader() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 22,
      background: 'var(--bg)',
    }}>
      {/* Monogram in a pulsing ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', width: 72, height: 72 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'conic-gradient(var(--accent) 0deg, transparent 130deg, var(--accent) 280deg, transparent 360deg)',
          }}
        />
        <div style={{
          position: 'absolute', inset: 3, borderRadius: '50%', background: 'var(--bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 30,
            color: 'var(--accent)', letterSpacing: '-0.04em',
          }}>A</span>
        </div>
      </motion.div>

      {/* Name */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        style={{
          fontFamily: 'var(--font-mono)', fontSize: 12,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}
      >
        Akash Sharma
      </motion.div>

      {/* Progress sweep */}
      <div style={{
        width: 140, height: 2, borderRadius: 2,
        background: 'var(--border)', overflow: 'hidden',
      }}>
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '60%', height: '100%', background: 'var(--accent)' }}
        />
      </div>
    </div>
  )
}
