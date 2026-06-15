import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { Analytics } from '@vercel/analytics/react'
import SmoothScroll from './lib/SmoothScroll'
import { useLenis } from './lib/lenis'
import { loadPortfolio } from './hooks/usePortfolioData'
import Cursor from './components/Cursor'
import Fab from './components/Fab'
import Navbar from './components/Navbar'
import Loader from './components/Loader'
import Home from './pages/Home'

const Universe = lazy(() => import('./components/three/Universe'))
const CaseStudy = lazy(() => import('./pages/CaseStudy'))

/* Last scroll position per history entry, so back/forward lands where the
   user left off while fresh navigations still start at the top.

   Positions are snapshotted at interaction time (pointerdown / keydown /
   popstate) — NOT from scroll events. Once navigation swaps the page the
   document shrinks and the browser clamps scrollY, so anything recorded
   during the transition is garbage. */
const scrollPositions = new Map<string, number>()
let activeKey = 'default'

// Module-level so it registers before BrowserRouter's own popstate listener —
// the snapshot must run before the router swaps (and reflows) the page.
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    scrollPositions.set(activeKey, window.scrollY)
  })
}

function ScrollRestoration() {
  const location = useLocation()
  const navType = useNavigationType()
  const lenis = useLenis()

  // The browser's own restoration fights Lenis — we handle it ourselves
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // Any click or keypress might be the one that navigates away — snapshot
  // the current position for this entry before handlers run.
  useEffect(() => {
    const snapshot = () => scrollPositions.set(activeKey, window.scrollY)
    window.addEventListener('pointerdown', snapshot, true)
    window.addEventListener('keydown', snapshot, true)
    return () => {
      window.removeEventListener('pointerdown', snapshot, true)
      window.removeEventListener('keydown', snapshot, true)
    }
  }, [])

  useEffect(() => {
    const saved = navType === 'POP' ? scrollPositions.get(location.key) : undefined
    const target = saved ?? 0
    activeKey = location.key
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined

    const restore = () => {
      const l = lenis.current
      if (l) {
        // Lenis caches the previous page's scroll limit — recompute before jumping
        l.resize()
        l.scrollTo(target, { immediate: true, force: true })
      } else {
        window.scrollTo(0, target)
      }
    }

    // Pinned scroll scenes (GSAP) and lazy content settle over a couple of
    // seconds, so retry until the position sticks instead of trusting the
    // first frame. The user taking over (wheel/touch/keys) cancels the loop.
    const DELAYS = [80, 160, 300, 500, 800, 1200]
    const attempt = (n: number) => {
      if (cancelled) return
      restore()
      if (n < DELAYS.length && Math.abs(window.scrollY - target) > 2) {
        timer = setTimeout(() => attempt(n + 1), DELAYS[n])
      }
    }

    const cancel = () => {
      cancelled = true
    }
    window.addEventListener('wheel', cancel, { passive: true })
    window.addEventListener('touchstart', cancel, { passive: true })
    window.addEventListener('keydown', cancel)

    const id = requestAnimationFrame(() => attempt(0))
    return () => {
      cancelled = true
      cancelAnimationFrame(id)
      if (timer) clearTimeout(timer)
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchstart', cancel)
      window.removeEventListener('keydown', cancel)
    }
  }, [location.key, navType, lenis])

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
        <Analytics />
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
            <Fab />
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
