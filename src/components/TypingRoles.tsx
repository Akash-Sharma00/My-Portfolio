import { useEffect, useState } from 'react'

interface Props {
  roles: string[]
  style?: React.CSSProperties
}

const TYPE_SPEED = 65      // ms per character typed
const DELETE_SPEED = 32    // ms per character deleted
const HOLD_TIME = 1500     // ms to hold a fully-typed word

/** Typewriter that cycles through roles — types, holds, deletes, repeats. */
export default function TypingRoles({ roles, style }: Props) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = roles[index % roles.length]

    // Word fully typed → hold, then start deleting
    if (!deleting && text === current) {
      const hold = setTimeout(() => setDeleting(true), HOLD_TIME)
      return () => clearTimeout(hold)
    }

    // Word fully deleted → brief pause, then advance to the next role
    if (deleting && text === '') {
      const gap = setTimeout(() => {
        setDeleting(false)
        setIndex(i => (i + 1) % roles.length)
      }, 360)
      return () => clearTimeout(gap)
    }

    const next = deleting
      ? current.slice(0, text.length - 1)
      : current.slice(0, text.length + 1)
    const t = setTimeout(() => setText(next), deleting ? DELETE_SPEED : TYPE_SPEED)
    return () => clearTimeout(t)
  }, [text, deleting, index, roles])

  return (
    <span style={style} aria-label={roles.join(', ')}>
      <span>{text}</span>
      <span
        aria-hidden
        style={{
          display: 'inline-block', width: 2, height: '1em',
          background: 'var(--accent)', marginLeft: 3,
          transform: 'translateY(2px)',
          animation: 'caret-blink 1s step-end infinite',
        }}
      />
      <style>{`@keyframes caret-blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </span>
  )
}
