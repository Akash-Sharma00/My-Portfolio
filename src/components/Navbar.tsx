import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLenis, scrollToSection } from '../lib/lenis'

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'Journey' },
  { id: 'skills', label: 'Arsenal' },
  { id: 'work', label: 'Work' },
  { id: 'lab', label: 'Lab' },
]

export default function Navbar() {
  const lenis = useLenis()
  const location = useLocation()
  const navigate = useNavigate()
  const [active, setActive] = useState('home')
  const onHome = location.pathname === '/'

  useEffect(() => {
    if (!onHome) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id)
        }
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    // Sections mount after data load — observe lazily
    const t = setTimeout(() => {
      LINKS.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
      const contact = document.getElementById('contact')
      if (contact) observer.observe(contact)
    }, 600)
    return () => {
      clearTimeout(t)
      observer.disconnect()
    }
  }, [onHome])

  const go = (id: string) => {
    if (onHome) {
      scrollToSection(lenis.current, `#${id}`)
    } else {
      navigate('/', { state: { scrollTo: id } })
    }
  }

  return (
    <motion.nav
      className="nav glass"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <button className="nav-logo" data-cursor="link" onClick={() => go('home')}>
        <span className="pulse" />
        AKS<span style={{ color: 'var(--ember)' }}>.13</span>
      </button>
      <div className="nav-links">
        {LINKS.map(({ id, label }) => (
          <button
            key={id}
            className={`nav-link${active === id && onHome ? ' active' : ''}`}
            data-cursor="link"
            onClick={() => go(id)}
          >
            {active === id && onHome && (
              <motion.span className="nav-pill" layoutId="nav-pill" transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
            )}
            {label}
          </button>
        ))}
      </div>
      <button className="nav-cta" data-cursor="link" onClick={() => go('contact')}>
        Open channel
      </button>
    </motion.nav>
  )
}
