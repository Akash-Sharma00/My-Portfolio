import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiArrowUp, FiDownload } from 'react-icons/fi'
import { useLenis } from '../lib/lenis'
import resumeUrl from '../assets/Akash_Sharma_CV.pdf?url'

const EASE = [0.16, 1, 0.3, 1] as const

/** Floating actions pinned bottom-right: resume download (always) and
 *  back-to-top (appears once the hero is behind you). */
export default function Fab() {
  const lenis = useLenis()
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toTop = () => {
    if (lenis.current) lenis.current.scrollTo(0, { duration: 1.4 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="fab-stack">
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="top"
            className="fab"
            aria-label="Scroll back to top"
            data-cursor="link"
            onClick={toTop}
            initial={{ opacity: 0, y: 18, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.8 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <FiArrowUp />
            <span className="fab-label">Top</span>
          </motion.button>
        )}
      </AnimatePresence>
      <motion.a
        className="fab fab-resume"
        href={resumeUrl}
        download="Akash_Sharma_Resume.pdf"
        aria-label="Download resume"
        data-cursor="link"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
      >
        <FiDownload />
        <span className="fab-label">Resume</span>
      </motion.a>
    </div>
  )
}
