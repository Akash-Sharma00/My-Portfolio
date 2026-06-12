import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePortfolioData } from '../hooks/usePortfolioData'
import { useLenis, scrollToSection } from '../lib/lenis'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Skills from '../sections/Skills'
import Projects from '../sections/Projects'
import Achievements from '../sections/Achievements'
import Lab from '../sections/Lab'
import Contact from '../sections/Contact'

export default function Home() {
  const { data, error } = usePortfolioData()
  const location = useLocation()
  const navType = useNavigationType()
  const lenis = useLenis()

  // Layout settles after data + images arrive — recompute pinned scroll scenes
  useEffect(() => {
    if (!data) return
    const t = setTimeout(() => ScrollTrigger.refresh(), 600)
    return () => clearTimeout(t)
  }, [data])

  // Arriving from another page with a target section. Only on fresh
  // navigations — the state sticks to the history entry, and honouring it on
  // back/forward would yank the user away from their restored position.
  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo
    if (!data || !target || navType === 'POP') return
    const t = setTimeout(() => scrollToSection(lenis.current, `#${target}`), 700)
    return () => clearTimeout(t)
  }, [data, location.state, navType, lenis])

  if (error) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <p className="mono" style={{ color: 'var(--ink-dim)' }}>
          Transmission failed — {error}
        </p>
      </main>
    )
  }

  if (!data) return null

  return (
    <main>
      <Hero personal={data.personal} />
      <About personal={data.personal} workExperience={data.workExperience} education={data.education} />
      <Skills data={data} />
      <Projects workExperience={data.workExperience} />
      <Achievements personal={data.personal} education={data.education} />
      <Lab projects={data.personalProjects} learnings={data.learnings} />
      <Contact personal={data.personal} />
    </main>
  )
}
