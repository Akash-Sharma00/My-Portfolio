import { SiGoogleplay, SiAppstore, SiGithub, SiDart } from 'react-icons/si'
import type { IconType } from 'react-icons'
import type { ProjectLink } from '../types'

interface BtnDef {
  label: string
  href: string
  bg: string
  Icon?: IconType
  emoji?: string
}

function buildButtons(links: ProjectLink, accentColor: string): BtnDef[] {
  const btns: BtnDef[] = []
  if (links.live      && links.live !== '#')      btns.push({ label: 'Visit Site',  href: links.live,      bg: accentColor,  emoji: '↗' })
  if (links.web       && links.web !== '#')        btns.push({ label: 'Visit Site',  href: links.web,       bg: accentColor,  emoji: '↗' })
  if (links.playstore && links.playstore !== '#')  btns.push({ label: 'Play Store',  href: links.playstore, bg: '#01875f',    Icon: SiGoogleplay })
  if (links.appstore  && links.appstore !== '#')   btns.push({ label: 'App Store',   href: links.appstore,  bg: '#007aff',    Icon: SiAppstore })
  if (links.android   && links.android !== '#')    btns.push({ label: 'Android',     href: links.android,   bg: '#3ddc84',    Icon: SiGoogleplay })
  if (links.ios       && links.ios !== '#')        btns.push({ label: 'iOS',         href: links.ios,       bg: '#007aff',    Icon: SiAppstore })
  if (links.github    && links.github !== '#')     btns.push({ label: 'GitHub',      href: links.github,    bg: '#8b949e',    Icon: SiGithub })
  if (links.pubdev    && links.pubdev !== '#')     btns.push({ label: 'pub.dev',     href: links.pubdev,    bg: '#00b4ab',    Icon: SiDart })
  return btns
}

interface Props {
  links: ProjectLink
  color: string
  onNavigate?: () => void
  size?: 'sm' | 'md'
}

export default function LinkButtons({ links, color, onNavigate, size = 'sm' }: Props) {
  const btns = buildButtons(links, color)
  const pad  = size === 'md' ? '6px 14px' : '4px 11px'
  const fs   = size === 'md' ? 12 : 11

  return (
    <div
      style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}
      onClick={e => e.stopPropagation()}
    >
      {btns.map(btn => (
        <a
          key={btn.label}
          href={btn.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: pad, borderRadius: 7,
            fontSize: fs, fontWeight: 600,
            background: `${btn.bg}18`, color: btn.bg,
            border: `1px solid ${btn.bg}35`,
            textDecoration: 'none',
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'nowrap',
            lineHeight: 1,
          }}
        >
          {btn.Icon
            ? <btn.Icon size={fs + 1} />
            : <span style={{ fontSize: fs }}>{btn.emoji}</span>
          }
          {btn.label}
        </a>
      ))}

      {onNavigate && (
        <button
          onClick={e => { e.stopPropagation(); onNavigate() }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: pad, borderRadius: 7,
            fontSize: fs, fontWeight: 500,
            color: 'var(--text-muted)',
            background: 'transparent',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
          }}
        >
          Details →
        </button>
      )}
    </div>
  )
}
