import type { Project } from '../types'

export function isMobileProject(p: { links: Project['links']; type?: string }) {
  return Boolean((p.links.playstore || p.links.appstore) && !p.links.live)
}

export function BrowserFrame({ src, url, alt }: { src: string; url?: string; alt: string }) {
  return (
    <div className="frame-browser">
      <div className="frame-bar">
        <i />
        <i />
        <i />
        <span className="frame-url">{url?.replace(/^https?:\/\//, '') ?? 'production.app'}</span>
      </div>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  )
}

export function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="frame-phone">
      <img src={src} alt={alt} loading="lazy" />
    </div>
  )
}

export function PhoneDuo({ shots, alt }: { shots: string[]; alt: string }) {
  return (
    <div className="phone-duo">
      <PhoneFrame src={shots[0]} alt={alt} />
      {shots[1] && <PhoneFrame src={shots[1]} alt={`${alt} — second screen`} />}
    </div>
  )
}

/** Picks the right mockup for a project based on its platform + screenshots. */
export default function DeviceFrame({
  project,
}: {
  project: Pick<Project, 'name' | 'links'> & { screenshots?: string[]; color: string }
}) {
  const shots = project.screenshots ?? []

  if (shots.length === 0) {
    return (
      <div
        className="glass scanlines"
        style={{
          width: '100%',
          aspectRatio: '16/10',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          letterSpacing: '0.3em',
          color: project.color,
        }}
      >
        ◈ INTERNAL SYSTEM
      </div>
    )
  }

  if (isMobileProject(project)) {
    return <PhoneDuo shots={shots} alt={project.name} />
  }

  return <BrowserFrame src={shots[0]} url={project.links.live} alt={project.name} />
}
