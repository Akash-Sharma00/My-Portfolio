import type { Project } from '../types'

/** Mobile-first projects ship to stores (or are app-typed) and have no web deployment. */
export function isMobileProject(p: { links: Project['links']; type?: string; category?: string }) {
  if (p.links.live || p.links.web) return false
  if (p.links.playstore || p.links.appstore) return true
  return /\bapp\b|mobile/i.test(`${p.type ?? ''} ${p.category ?? ''}`)
}
