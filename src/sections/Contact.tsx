import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Personal } from '../types'
import Magnetic from '../components/Magnetic'
import resumeUrl from '../assets/Akash_Sharma_CV.pdf?url'

interface Channel {
  label: string
  value: string
  icon: string
  color: string
  href?: string
  download?: string
  onActivate?: () => void
}

function Hologram({ ch, index }: { ch: Channel; index: number }) {
  const inner = (
    <motion.article
      className="cr-hologram glass holo-border scanlines"
      style={{ ['--cc' as string]: ch.color }}
      initial={{ opacity: 0, y: 50, rotateX: 18 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
    >
      <span className="ch-icon">{ch.icon}</span>
      <span className="ch-label">{ch.label}</span>
      <span className="ch-value">{ch.value}</span>
    </motion.article>
  )

  return (
    <Magnetic strength={0.18} className="cr-channel">
      {ch.href ? (
        <a
          href={ch.href}
          target={ch.href.startsWith('http') ? '_blank' : undefined}
          rel="noreferrer"
          download={ch.download}
          data-cursor="link"
          onClick={ch.onActivate}
          style={{ display: 'block' }}
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </Magnetic>
  )
}

export default function Contact({ personal }: { personal: Personal }) {
  const [copied, setCopied] = useState(false)

  const channels: Channel[] = [
    {
      label: copied ? 'Copied ✓' : 'Email',
      value: personal.email,
      icon: '✉',
      color: '#ff6535',
      href: `mailto:${personal.email}`,
      onActivate: () => {
        navigator.clipboard?.writeText(personal.email).catch(() => {})
        setCopied(true)
        setTimeout(() => setCopied(false), 2200)
      },
    },
    {
      label: 'GitHub',
      value: personal.social.github.replace('https://github.com/', '@'),
      icon: '⌥',
      color: '#8b7bff',
      href: personal.social.github,
    },
    {
      label: 'LinkedIn',
      value: personal.social.linkedin.replace('https://www.linkedin.com/in/', 'in/'),
      icon: '⊙',
      color: '#4cd9ed',
      href: personal.social.linkedin,
    },
    {
      label: 'Resume',
      value: 'Akash_Sharma_Resume.pdf',
      icon: '⇣',
      color: '#4ade80',
      href: resumeUrl,
      download: 'Akash_Sharma_Resume.pdf',
    },
  ]

  return (
    <>
      <section id="contact" className="control-room">
        <motion.span
          className="kicker"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          06 · Final Transmission
        </motion.span>
        <motion.h2
          className="cr-title"
          initial={{ opacity: 0, y: 60, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Let&apos;s build the <span className="text-aurora">next thing.</span>
        </motion.h2>
        <motion.p
          className="section-sub"
          style={{ margin: '20px auto 0' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {personal.status}. If you&apos;re shipping something ambitious — a product, a platform, a
          hard problem — open a channel.
        </motion.p>

        <div className="cr-channels" style={{ perspective: 1000 }}>
          {channels.map((ch, i) => (
            <Hologram key={ch.label + String(i)} ch={ch} index={i} />
          ))}
        </div>

        <div className="cr-meta">
          <span>{personal.location}</span>
          <span>{personal.phone}</span>
          <span>UTC +5:30</span>
        </div>
      </section>

      <footer className="footer">
        <span>© {new Date().getFullYear()} {personal.name} — crafted in a digital universe</span>
        <span>React · TypeScript · Three.js · GSAP · Lenis</span>
      </footer>
    </>
  )
}
