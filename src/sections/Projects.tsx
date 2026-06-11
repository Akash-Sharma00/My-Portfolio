import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Project, WorkExperience } from '../types'
import { SectionHead } from '../components/Section'
import DeviceFrame from '../components/DeviceFrame'
import Tilt from '../components/Tilt'
import { useIsMobile, usePrefersReducedMotion } from '../hooks/useMedia'

gsap.registerPlugin(ScrollTrigger)

function Exhibit({ project }: { project: Project }) {
  return (
    <Link to={`/project/${project.id}`} data-cursor="view" style={{ display: 'contents' }}>
      <article className="exhibit glass holo-border" style={{ ['--pc' as string]: project.color }}>
        <span className="exhibit-glow" />
        <div className="exhibit-info">
          <span className="ex-type">
            {project.type} · {project.company}
          </span>
          <h3>{project.name}</h3>
          <p className="ex-summary">{project.summary}</p>
          <div className="ex-impact">{project.impact}</div>
          <div className="ex-tech">
            {project.tech.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
          <span className="ex-open">
            Enter case study
            <span className="arrow">→</span>
          </span>
        </div>
        <div className="exhibit-visual">
          <motion.div
            style={{ width: '100%', display: 'grid', placeItems: 'center' }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Tilt max={7} style={{ width: '100%', display: 'grid', placeItems: 'center' }}>
              <DeviceFrame project={project} />
            </Tilt>
          </motion.div>
        </div>
      </article>
    </Link>
  )
}

export default function Projects({ workExperience }: { workExperience: WorkExperience[] }) {
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLElement>(null)
  const mobile = useIsMobile()
  const reduced = usePrefersReducedMotion()
  const horizontal = !mobile && !reduced

  const all = workExperience.flatMap((exp) => exp.projects)
  const featured = all.filter((p) => p.featured)
  const archive = all.filter((p) => !p.featured)

  useLayoutEffect(() => {
    if (!horizontal || !pinRef.current || !trackRef.current) return

    const ctx = gsap.context(() => {
      const track = trackRef.current!
      const distance = () => track.scrollWidth - window.innerWidth

      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`
          },
        },
      })
    }, pinRef)

    return () => ctx.revert()
  }, [horizontal, featured.length])

  return (
    <section id="work" className="museum">
      <div className="section" style={{ paddingBottom: 24 }}>
        <SectionHead
          kicker="03 · The Museum"
          title={
            <>
              Work that ships, <span className="text-aurora">at scale.</span>
            </>
          }
          sub={
            horizontal
              ? 'A gallery of production systems. Keep scrolling — the museum moves with you. Step into any exhibit for the full case study.'
              : 'A gallery of production systems. Tap any exhibit for the full case study.'
          }
        />
      </div>

      {horizontal ? (
        <div className="museum-pin" ref={pinRef}>
          <div className="museum-track" ref={trackRef}>
            {featured.map((p) => (
              <Exhibit key={p.id} project={p} />
            ))}
          </div>
          <div className="museum-progress">
            <span>TOUR</span>
            <span className="bar">
              <i ref={barRef} style={{ transform: 'scaleX(0)' }} />
            </span>
            <span>{String(featured.length).padStart(2, '0')} EXHIBITS</span>
          </div>
        </div>
      ) : (
        <div className="museum-stack">
          {featured.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: (i % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <Exhibit project={p} />
            </motion.div>
          ))}
        </div>
      )}

      {archive.length > 0 && (
        <div className="section" style={{ paddingTop: 'clamp(56px, 9vh, 110px)' }}>
          <motion.p
            className="kicker"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ marginBottom: 26 }}
          >
            Deep cuts · internal systems & features
          </motion.p>
          <div className="archive-grid">
            {archive.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to={`/project/${p.id}`} data-cursor="view">
                  <article className="archive-card glass holo-border" style={{ ['--pc' as string]: p.color }}>
                    <span className="ac-type">{p.type}</span>
                    <h4>{p.name}</h4>
                    <p>{p.summary}</p>
                    <div className="ac-tech">
                      {p.tech.slice(0, 4).map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
