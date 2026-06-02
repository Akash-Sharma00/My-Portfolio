import type { IconType } from 'react-icons'
import {
  SiFlutter, SiDart, SiReact, SiNodedotjs, SiTypescript, SiJavascript,
  SiMongodb, SiPostgresql, SiFirebase, SiPython, SiDocker, SiGit,
  SiNestjs, SiVercel, SiSqlite, SiGo, SiHtml5, SiSocketdotio,
  SiSupabase, SiApachekafka, SiFastapi, SiRazorpay,
  SiGooglemaps, SiN8N, SiOpenjdk,
  SiAnthropic, SiOpenai, SiGooglegemini,
  SiAndroidstudio, SiVite, SiGoogleplay, SiAppstore,
} from 'react-icons/si'

interface TechDef {
  Icon?: IconType
  color: string
  label?: string
}

export const TECH_MAP: Record<string, TechDef> = {
  'Flutter':                        { Icon: SiFlutter,      color: '#54C5F8' },
  'Dart':                           { Icon: SiDart,         color: '#0175C2' },
  'React':                          { Icon: SiReact,        color: '#61DAFB' },
  'Node.js':                        { Icon: SiNodedotjs,    color: '#68A063' },
  'TypeScript':                     { Icon: SiTypescript,   color: '#3178C6' },
  'JavaScript':                     { Icon: SiJavascript,   color: '#F7DF1E' },
  'MongoDB':                        { Icon: SiMongodb,      color: '#47A248' },
  'PostgreSQL':                     { Icon: SiPostgresql,   color: '#336791' },
  'Firebase':                       { Icon: SiFirebase,     color: '#FFCA28' },
  'Python':                         { Icon: SiPython,       color: '#3776AB' },
  'Docker':                         { Icon: SiDocker,       color: '#2496ED' },
  'Git':                            { Icon: SiGit,          color: '#F05032' },
  'Git / GitHub':                   { Icon: SiGit,          color: '#F05032' },
  'NestJS':                         { Icon: SiNestjs,       color: '#E0234E' },
  'Vercel':                         { Icon: SiVercel,       color: '#888888' },
  'SQLite':                         { Icon: SiSqlite,       color: '#0B84E3' },
  'GoLang':                         { Icon: SiGo,           color: '#00ADD8' },
  'Go':                             { Icon: SiGo,           color: '#00ADD8' },
  'HTML / CSS':                     { Icon: SiHtml5,        color: '#E34F26' },
  'HTML/CSS':                       { Icon: SiHtml5,        color: '#E34F26' },
  'Socket.io':                      { Icon: SiSocketdotio,  color: '#888888' },
  'Supabase':                       { Icon: SiSupabase,     color: '#3ECF8E' },
  'AWS':                            { color: '#FF9900', label: 'AWS' },
  'Apache Kafka':                   { Icon: SiApachekafka,  color: '#888888' },
  'Kafka':                          { Icon: SiApachekafka,  color: '#888888' },
  'FastAPI':                        { Icon: SiFastapi,      color: '#009688' },
  'Razorpay':                       { Icon: SiRazorpay,     color: '#2C6EEB' },
  'In-App Purchase':                { color: '#34D399',     label: 'IAP' },
  'Google Maps SDK':                { Icon: SiGooglemaps,   color: '#4285F4' },
  'Google Maps':                    { Icon: SiGooglemaps,   color: '#4285F4' },
  // Text-badge fallbacks
  'BLOC':                           { color: '#62B2F0', label: 'BLoC' },
  'Zustand':                        { color: '#FF8C66', label: 'Zus' },
  'Provider':                       { color: '#54C5F8', label: 'Prv' },
  'Hive':                           { color: '#F6C90E', label: 'Hive' },
  'SQL':                            { color: '#336791', label: 'SQL' },
  'API Integration':                { color: '#6366f1', label: 'API' },
  'API integration':                { color: '#6366f1', label: 'API' },
  'LangChain':                      { color: '#1C7C5C', label: 'LC' },
  'LLaMA2 13B':                     { color: '#7C3AED', label: 'AI' },
  'ZPL (Zebra Printing Language)':  { color: '#FF8C00', label: 'ZPL' },
  'ZPL':                            { color: '#FF8C00', label: 'ZPL' },
  'Pinecone':                       { color: '#0F9D58', label: 'Pin' },
  'Grok':                           { color: '#888888', label: 'Gk' },
  'Google Fit API':                 { color: '#4285F4', label: 'GF' },
  'Zego Cloud':                     { color: '#1890FF', label: 'ZG' },
  'Java':                           { Icon: SiOpenjdk,      color: '#ED8B00' },
  'JAVA':                           { Icon: SiOpenjdk,      color: '#ED8B00' },
  'N8N':                            { Icon: SiN8N,          color: '#EA4B71' },
  // AI Tools
  'Claude Code':                    { Icon: SiAnthropic,    color: '#D97757' },
  'ChatGPT':                        { Icon: SiOpenai,       color: '#74AA9C' },
  'Codex':                          { Icon: SiOpenai,       color: '#74AA9C' },
  'Gemini':                         { Icon: SiGooglegemini, color: '#8B5CF6' },
  'Cursor':                         { color: '#2563EB',     label: 'Cur' },
  'Antigravity':                    { color: '#FF8C00',     label: '⚡' },
  // IDEs
  'VS Code':                        { color: '#007ACC',     label: '</>' },
  'Android Studio':                 { Icon: SiAndroidstudio, color: '#3DDC84' },
  // New skills
  'Vite':                           { Icon: SiVite,         color: '#646CFF' },
  'Play Store':                     { Icon: SiGoogleplay,   color: '#414141' },
  'App Store':                      { Icon: SiAppstore,     color: '#0D84FF' },
  'REST API':                       { color: '#6366f1',     label: 'REST' },
  'RAG Systems':                    { color: '#10B981',     label: 'RAG' },
  'XML':                            { color: '#F97316', label: 'XML' },
  'SCORM':                          { color: '#FF8C00', label: 'SC' },
  'XAPI':                           { color: '#6B7280', label: 'xAPI' },
}

interface Props {
  tech: string
  size?: number
  showLabel?: boolean
}

export default function TechIcon({ tech, size = 18, showLabel = false }: Props) {
  const def = TECH_MAP[tech] || { color: 'var(--text-muted)', label: tech.slice(0, 3) }

  if (def.Icon) {
    const Icon = def.Icon
    return (
      <span title={tech} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <Icon size={size} color={def.color} />
        {showLabel && <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{tech}</span>}
      </span>
    )
  }

  // Fallback: colored badge
  return (
    <span title={tech} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, borderRadius: 4,
      background: `${def.color}22`,
      border: `1px solid ${def.color}44`,
      fontSize: size <= 16 ? 8 : 10,
      fontWeight: 700,
      color: def.color,
      fontFamily: 'var(--font-mono)',
      letterSpacing: '-0.03em',
      flexShrink: 0,
    }}>
      {showLabel ? (
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, width: 'auto', height: 'auto', background: 'none', border: 'none' }}>
          {tech}
        </span>
      ) : (def.label || tech.slice(0, 2))}
    </span>
  )
}

export function TechBadge({ tech }: { tech: string }) {
  const def = TECH_MAP[tech] || { color: 'var(--text-muted)', label: tech.slice(0, 3) }

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 10px',
      borderRadius: 100,
      background: `${def.color}10`,
      border: `1px solid ${def.color}28`,
      color: def.color,
      fontSize: 12, fontWeight: 500,
      fontFamily: 'var(--font-body)',
      whiteSpace: 'nowrap',
    }}>
      {def.Icon
        ? <def.Icon size={13} />
        : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700 }}>{def.label || tech.slice(0, 2)}</span>
      }
      {tech}
    </span>
  )
}
