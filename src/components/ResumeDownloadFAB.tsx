import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import resumeUrl from '../assets/Akash_Sharma_CV.pdf?url'

const RING = 132
const BTN = 58
const OFFSET = (RING - BTN) / 2
const R = 56
const CX = RING / 2
const CY = RING / 2

export default function ResumeDownloadFAB() {
  const [hovered, setHovered] = useState(false)

  return (
    <>
      <style>{`
        @keyframes fab-rotate { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        pointerEvents: 'none',
      }}>
        {/* Slide-in tooltip */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.18 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--accent-border)',
                borderRadius: 8,
                padding: '5px 12px',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow-card)',
                pointerEvents: 'none',
                letterSpacing: '0.04em',
              }}
            >
              Download Resume
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ring + button */}
        <div style={{ position: 'relative', width: RING, height: RING, pointerEvents: 'auto' }}>

          {/* Dashed border ring (static) */}
          <svg
            width={RING} height={RING}
            viewBox={`0 0 ${RING} ${RING}`}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
          >
            <circle
              cx={CX} cy={CY} r={R}
              fill="none"
              stroke="var(--accent-border)"
              strokeWidth="1"
              strokeDasharray="3 7"
            />
          </svg>

          {/* Rotating text ring */}
          <svg
            width={RING} height={RING}
            viewBox={`0 0 ${RING} ${RING}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              animation: 'fab-rotate 18s linear infinite',
              transformOrigin: `${CX}px ${CY}px`,
              pointerEvents: 'none',
            }}
          >
            <defs>
              <path
                id="fab-ring-path"
                d={`M ${CX},${CY} m -${R},0 a ${R},${R} 0 1,1 ${R * 2},0 a ${R},${R} 0 1,1 -${R * 2},0`}
              />
            </defs>
            <text
              fill="var(--text-muted)"
              fontSize="8.5"
              fontFamily="'JetBrains Mono', monospace"
              letterSpacing="2.2"
            >
              <textPath href="#fab-ring-path" startOffset="0%">
                SR. ENGINEER · BOTAI SOLUTIONS · OPEN TO WORK ·
              </textPath>
            </text>
          </svg>

          {/* Download button */}
          <motion.a
            href={resumeUrl}
            download="Akash_Sharma_Resume.pdf"
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            style={{
              position: 'absolute',
              top: OFFSET,
              left: OFFSET,
              width: BTN,
              height: BTN,
              borderRadius: '50%',
              background: 'var(--accent)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 24px rgba(255, 101, 53, 0.45)',
              textDecoration: 'none',
            }}
          >
            <svg
              width="22" height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3v12" />
              <path d="M8.5 11.5l3.5 3.5 3.5-3.5" />
              <path d="M4 19h16" />
            </svg>
          </motion.a>
        </div>
      </div>
    </>
  )
}
