import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdEmail, MdContentCopy, MdCheck } from 'react-icons/md'
import { FaGithub, FaLinkedin, FaPhone } from 'react-icons/fa'
import { HiDownload } from 'react-icons/hi'
import type { Personal } from '../types'
import Magnetic from '../components/Magnetic'
import resumeUrl from '../assets/Akash_Sharma_CV.pdf?url'
import type { IconType } from 'react-icons'

interface Channel {
  key: string
  label: string
  value: string
  copyValue: string
  Icon: IconType
  color: string
  href?: string
  download?: string
}

function CopyBtn({ copyValue, isCopied, onCopy }: { copyValue: string; isCopied: boolean; onCopy: (v: string) => void }) {
  return (
    <button
      className="ch-copy-btn"
      title="Copy"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onCopy(copyValue)
      }}
      aria-label="Copy to clipboard"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isCopied ? (
          <motion.span key="check" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.18 }}>
            <MdCheck size={14} />
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.18 }}>
            <MdContentCopy size={14} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

function Hologram({ ch, index, isCopied, onCopy }: { ch: Channel; index: number; isCopied: boolean; onCopy: (v: string) => void }) {
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
      <CopyBtn copyValue={ch.copyValue} isCopied={isCopied} onCopy={onCopy} />
      <span className="ch-icon"><ch.Icon size={28} /></span>
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
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  function copy(key: string, value: string) {
    navigator.clipboard?.writeText(value).catch(() => {})
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2200)
  }

  const channels: Channel[] = [
    {
      key: 'email',
      label: 'Email',
      value: personal.email,
      copyValue: personal.email,
      Icon: MdEmail,
      color: '#ff6535',
      href: `mailto:${personal.email}`,
    },
    {
      key: 'github',
      label: 'GitHub',
      value: personal.social.github.replace('https://github.com/', '@'),
      copyValue: personal.social.github,
      Icon: FaGithub,
      color: '#8b7bff',
      href: personal.social.github,
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      value: personal.social.linkedin.replace('https://www.linkedin.com/in/', 'in/'),
      copyValue: personal.social.linkedin,
      Icon: FaLinkedin,
      color: '#4cd9ed',
      href: personal.social.linkedin,
    },
    {
      key: 'resume',
      label: 'Resume',
      value: 'Akash_Sharma_Resume.pdf',
      copyValue: resumeUrl,
      Icon: HiDownload,
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
            <Hologram
              key={ch.key}
              ch={ch}
              index={i}
              isCopied={copiedKey === ch.key}
              onCopy={(v) => copy(ch.key, v)}
            />
          ))}
        </div>

        <div className="cr-meta">
          <span>{personal.location}</span>
          <span className="cr-meta-phone">
            <FaPhone size={11} style={{ marginRight: 5, opacity: 0.7 }} />
            {personal.phone}
            <button
              className="cr-meta-copy-btn"
              title="Copy phone"
              onClick={() => copy('phone', personal.phone)}
              aria-label="Copy phone number"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copiedKey === 'phone' ? (
                  <motion.span key="check" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <MdCheck size={12} />
                  </motion.span>
                ) : (
                  <motion.span key="copy" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <MdContentCopy size={12} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </span>
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
