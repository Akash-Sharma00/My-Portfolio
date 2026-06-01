import TechIcon from './TechIcon'
import { TECH_MAP } from './TechIcon'

interface Props {
  tech: string
  size?: number
  spinDuration?: number
  bobDuration?: number
  spinDelay?: number
  bobDelay?: number
}

export default function TechCube({
  tech,
  size = 60,
  spinDuration = 10,
  bobDuration = 4,
  spinDelay = 0,
  bobDelay = 0,
}: Props) {
  const def = TECH_MAP[tech] || { color: '#888888' }
  const color = def.color
  const half = size / 2
  const br = Math.round(size * 0.18)

  const face = (transform: string, bgAlpha = '08', borderAlpha = '25'): React.CSSProperties => ({
    position: 'absolute',
    width: size,
    height: size,
    border: `1px solid ${color}${borderAlpha}`,
    background: `${color}${bgAlpha}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform,
    borderRadius: br,
    willChange: 'transform',
  })

  return (
    <div
      style={{
        width: size,
        height: size,
        perspective: size * 4,
        animation: `cubeBob ${bobDuration}s ease-in-out infinite`,
        animationDelay: `${bobDelay}s`,
        flexShrink: 0,
        willChange: 'transform',
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          position: 'relative',
          transformStyle: 'preserve-3d',
          animation: `cubeSpin ${spinDuration}s linear infinite`,
          animationDelay: `${spinDelay}s`,
          willChange: 'transform',
        }}
      >
        {/* Front — icon face */}
        <div
          style={{
            ...face(`translateZ(${half}px)`, '18', '45'),
            background: `linear-gradient(135deg, ${color}1a 0%, ${color}0c 100%)`,
            boxShadow: `inset 0 1px 0 ${color}20, 0 0 ${size * 0.4}px ${color}15`,
          }}
        >
          <TechIcon tech={tech} size={Math.round(size * 0.44)} />
        </div>
        {/* Back */}
        <div style={face(`rotateY(180deg) translateZ(${half}px)`, '06', '18')} />
        {/* Left */}
        <div style={face(`rotateY(-90deg) translateZ(${half}px)`, '06', '18')} />
        {/* Right */}
        <div style={face(`rotateY(90deg) translateZ(${half}px)`, '10', '22')} />
        {/* Top */}
        <div style={face(`rotateX(90deg) translateZ(${half}px)`, '12', '28')} />
        {/* Bottom */}
        <div style={face(`rotateX(-90deg) translateZ(${half}px)`, '04', '15')} />
      </div>
    </div>
  )
}
