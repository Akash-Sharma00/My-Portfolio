import type { Project } from '../types'

/** Mobile-first projects ship to stores and have no web deployment. */
export function isMobileProject(p: { links: Project['links']; type?: string }) {
  return Boolean((p.links.playstore || p.links.appstore) && !p.links.live)
}
