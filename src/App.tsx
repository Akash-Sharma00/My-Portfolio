import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import SmoothScroll from './lib/SmoothScroll'
import { useLenis } from './lib/lenis'
import { loadPortfolio } from './hooks/usePortfolioData'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Loader from './components/Loader'
import Home from './pages/Home'

const Universe = lazy(() => import('./components/three/Universe'))
const CaseStudy = lazy(() => import('./pages/CaseStudy'))

function ScrollRestoration() {
  const { pathname } = useLocation()
  const lenis = useLenis()
  useEffect(() => {
    if (lenis.current) lenis.current.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname, lenis])
  return null
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })
  return <motion.div className="scroll-progress" style={{ scaleX }} />
}

export default function App() {
  const [booted, setBooted] = useState(false)

  useEffect(() => {
    const minDelay = new Promise((r) => setTimeout(r, 1900))
    Promise.allSettled([loadPortfolio(), minDelay]).then(() => setBooted(true))
  }, [])

  return (
    <BrowserRouter>
      <SmoothScroll>
        <AnimatePresence>{!booted && <Loader />}</AnimatePresence>
        <Suspense fallback={null}>
          <Universe />
        </Suspense>
        <div className="vignette" />
        <div className="grain" />
        <Cursor />
        {booted && (
          <div className="app-shell">
            <ScrollRestoration />
            <ScrollProgress />
            <Navbar />
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/project/:id" element={<CaseStudy />} />
              </Routes>
            </Suspense>
          </div>
        )}
      </SmoothScroll>
    </BrowserRouter>
  )
}
