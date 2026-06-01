import { EASE } from '../utils/motion'
import { motion } from 'framer-motion'
import { useState } from 'react'
import type { Personal } from '../types'

interface Props { data: Personal }

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <button
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy'}
      style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
        color: copied ? 'var(--accent)' : 'var(--text-muted)', display: 'inline-flex',
        alignItems: 'center', borderRadius: 4, transition: 'color 0.2s', marginLeft: 6,
      }}
    >
      {copied
        ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
      }
    </button>
  )
}

export default function About({ data }: Props) {
  return (
    <section id="about" className="section">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }} className="about-grid">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="section-label">About</span>
            <h2 className="section-title">Building things that<br />actually matter</h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.85, marginBottom: 20 }}>
              {data.aboutExtended}
            </p>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8 }}>
              When I'm not shipping features, I'm usually experimenting — a RAG system, an open-source observability tool, or a new Flutter package. I like problems where constraints are real and the users are actual humans depending on the thing working.
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px 28px', boxShadow: 'var(--shadow-card)' }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-muted)', marginBottom: 18, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
                What I focus on
              </div>
              {[
                { icon: '📱', title: 'Mobile', desc: 'Flutter apps for Android & iOS — architecture to App Store' },
                { icon: '🌐', title: 'Web', desc: 'React frontends with clean state management and fast UIs' },
                { icon: '⚙️', title: 'Backend', desc: 'Node.js, Python, GoLang APIs — whichever fits the job' },
                { icon: '🤖', title: 'AI Tooling', desc: 'RAG systems, LLM integrations, and workflow automation with N8N' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.4, ease: EASE }}
                  style={{ display: 'flex', gap: 14, marginBottom: i < 3 ? 16 : 0, alignItems: 'flex-start' }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px 28px', boxShadow: 'var(--shadow-card)' }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
                Contact
              </div>
              {[
                { label: 'Email',    value: data.email,                                        copy: data.email,         href: `mailto:${data.email}` },
                { label: 'Phone',    value: data.phone,                                        copy: data.phone,         href: `tel:${data.phone}` },
                { label: 'GitHub',   value: data.social.github.replace('https://', ''),        copy: data.social.github, href: data.social.github },
                { label: 'LinkedIn', value: data.social.linkedin.replace('https://www.', ''), copy: data.social.linkedin, href: data.social.linkedin },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 }}>
                  <span style={{ fontSize: 12.5, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <a href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                      style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500, transition: 'color 0.15s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text)')}
                    >
                      {item.value}
                    </a>
                    <CopyButton text={item.copy} />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  )
}
