import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useScroll,
  useTime,
  useTransform,
  type Variants,
} from 'framer-motion'
import { SiFlutter } from 'react-icons/si'
import type { Personal } from '../types'
import Tilt from '../components/Tilt'
import Magnetic from '../components/Magnetic'
import { useLenis, scrollToSection } from '../lib/lenis'
import { useIsCoarsePointer } from '../hooks/useMedia'

const EASE = [0.16, 1, 0.3, 1] as const

const ROLES: { label: string; color?: string; flutter?: boolean }[] = [
  { label: 'Flutter Engineer', flutter: true },
  { label: 'Sr. Software Engineer', color: '#ff6535' },
  { label: 'Full Stack Developer', color: '#8b7bff' },
  { label: 'Product Builder', color: '#fbbf24' },
  { label: 'Problem Solver', color: '#4ade80' },
]

/* Each role enters with its own choreography */
const ROLE_VARIANTS: Variants[] = [
  {
    initial: { opacity: 0, filter: 'blur(14px)' },
    animate: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.6 } },
    exit: { opacity: 0, filter: 'blur(10px)', transition: { duration: 0.3 } },
  },
  {
    initial: { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
    exit: { opacity: 0, y: -26, transition: { duration: 0.3 } },
  },
  {
    initial: { opacity: 0, scale: 1.45, letterSpacing: '0.3em' },
    animate: { opacity: 1, scale: 1, letterSpacing: '0em', transition: { duration: 0.6, ease: EASE } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  },
  {
    initial: { opacity: 0, rotateX: 95 },
    animate: { opacity: 1, rotateX: 0, transition: { duration: 0.6, ease: EASE } },
    exit: { opacity: 0, rotateX: -95, transition: { duration: 0.3 } },
  },
]

function NameLine({ text, delay }: { text: string; delay: number }) {
  return (
    <span className="line" aria-hidden>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          initial={{ y: '110%', rotate: 8, opacity: 0 }}
          animate={{ y: '0%', rotate: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: delay + i * 0.045, ease: EASE }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  )
}

function RoleRotator() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ROLES.length), 2600)
    return () => clearInterval(id)
  }, [])
  const role = ROLES[index]

  return (
    <div className="hero-roles" style={{ perspective: 600 }}>
      <span className="role-index">
        {String(index + 1).padStart(2, '0')} / {String(ROLES.length).padStart(2, '0')}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className="role-text"
          variants={ROLE_VARIANTS[index % ROLE_VARIANTS.length]}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ display: 'inline-block' }}
        >
          {role.flutter ? (
            <span className="role-flutter">
              <motion.span
                className="flutter-icon"
                animate={{ y: [0, -4, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <SiFlutter />
              </motion.span>
              <span className="flutter-text">{role.label}</span>
            </span>
          ) : (
            <span style={{ color: role.color, textShadow: `0 0 26px ${role.color}66` }}>
              {role.label}
            </span>
          )}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

/* Tech badge orbiting the holographic card on an elliptical 3D path */
function OrbitItem({ label, offset, total }: { label: string; offset: number; total: number }) {
  const time = useTime()
  const angle = useTransform(time, (t) => (t / 14000) * Math.PI * 2 + (offset / total) * Math.PI * 2)
  const x = useTransform(angle, (a) => Math.cos(a) * 215)
  const y = useTransform(angle, (a) => Math.sin(a) * 46)
  const depth = useTransform(angle, (a) => Math.sin(a)) // -1 back … 1 front
  const scale = useTransform(depth, [-1, 1], [0.72, 1.06])
  const opacity = useTransform(depth, [-1, 1], [0.3, 1])
  const zIndex = useTransform(depth, (d) => (d > 0 ? 3 : 0))

  return (
    <motion.span className="orbit-item" style={{ x, y, scale, opacity, zIndex }}>
      {label}
    </motion.span>
  )
}

export default function Hero({ personal }: { personal: Personal }) {
  const ref = useRef<HTMLElement>(null)
  const lenis = useLenis()
  const coarse = useIsCoarsePointer()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const exitY = useTransform(scrollYProgress, [0, 1], [0, -140])
  const exitOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const exitBlur = useTransform(scrollYProgress, [0, 0.7], ['blur(0px)', 'blur(8px)'])
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const cardRotate = useTransform(scrollYProgress, [0, 1], [0, 10])

  const orbitTech = [...personal.specializations, 'TypeScript', 'Python', 'AWS']

  return (
    <section id="home" className="hero" ref={ref}>
      <div className="hero-grid">
        <motion.div style={{ y: exitY, opacity: exitOpacity, filter: exitBlur }}>
          <motion.p
            className="hero-boot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {personal.status} · {personal.location.split('—')[1]?.trim() ?? personal.location}
          </motion.p>

          <h1 className="hero-name" aria-label={personal.name}>
            <NameLine text="Akash" delay={0.35} />
            <NameLine text="Sharma" delay={0.55} />
          </h1>

          <motion.p
            className="hero-tagline"
            initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 1.15, ease: EASE }}
          >
            Building digital products <span className="text-aurora">that scale.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <RoleRotator />
          </motion.div>

          <motion.div
            className="hero-ctas"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.85, ease: EASE }}
          >
            <Magnetic>
              <button
                className="btn btn-primary"
                data-cursor="link"
                onClick={() => scrollToSection(lenis.current, '#work')}
              >
                <span className="btn-sheen" />
                Explore the work
              </button>
            </Magnetic>
            <Magnetic>
              <button
                className="btn btn-ghost"
                data-cursor="link"
                onClick={() => scrollToSection(lenis.current, '#contact')}
              >
                <span className="btn-sheen" />
                Initiate contact
              </button>
            </Magnetic>
          </motion.div>

          <motion.div
            className="hero-meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.1 }}
          >
            {personal.stats.map((s) => (
              <div key={s.label}>
                <b>{s.value}</b>
                {s.label}
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="holo-stage"
          style={{ y: cardY, rotateY: cardRotate }}
          initial={{ opacity: 0, scale: 0.85, y: 60 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.9, ease: EASE }}
        >
          <Tilt max={coarse ? 0 : 12}>
            <div className="holo-card scanlines">
              <span className="glare" />
              <div className="holo-card-head">
                <span>ID · AKS-13</span>
                <span style={{ color: 'var(--mint)' }}>● ONLINE</span>
              </div>
              <div className="holo-avatar">
                <img src="/images/my-pic.png" alt="Akash Sharma" loading="eager" />
              </div>
              <div className="holo-card-name">{personal.name}</div>
              <div className="holo-card-role">{personal.title}</div>
              <div className="holo-card-rows">
                <div>
                  <span>BASE</span>
                  <b>{personal.location.split(',').join(' · ')}</b>
                </div>
                <div>
                  <span>EXPERIENCE</span>
                  <b>{personal.stats[0]?.value} years</b>
                </div>
                <div>
                  <span>STACK</span>
                  <b>{personal.specializations.join(' · ')}</b>
                </div>
              </div>
            </div>
          </Tilt>

          {!coarse && (
            <div className="orbit-ring" aria-hidden>
              {orbitTech.map((t, i) => (
                <OrbitItem key={t} label={t} offset={i} total={orbitTech.length} />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        className="hero-scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 1 }}
        style={{ opacity: exitOpacity }}
      >
        <span className="wheel">
          <i />
        </span>
        Scroll to enter
      </motion.div>
    </section>
  )
}
