import { useState, useEffect } from 'react'
import type { Portfolio } from '../types'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import Experience from '../components/Experience'
import PersonalProjects from '../components/PersonalProjects'
import Education from '../components/Education'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Home() {
  const [data, setData] = useState<Portfolio | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/data/portfolio.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => setError(true))
  }, [])

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Could not load portfolio data.</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          border: '2px solid var(--border)',
          borderTopColor: 'var(--accent)',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero data={data.personal} />
        <About data={data.personal} />
        <Skills skills={data.skills} aiTools={data.aiTools} />
        <Experience experiences={data.workExperience} />
        <PersonalProjects projects={data.personalProjects} contributions={data.contributions} />
        <Education education={data.education} learnings={data.learnings} />
        <Contact data={data.personal} />
      </main>
      <Footer />
    </>
  )
}
