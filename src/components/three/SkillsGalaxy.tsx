import { createElement, useEffect, useMemo, useRef, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { SKILL_ICONS } from '../../lib/skillIcons'
import { useIsMobile } from '../../hooks/useMedia'

export interface GalaxyCategory {
  name: string
  color: string
  skills: string[]
}

export interface GalaxySelection {
  skill: string
  category: string
  color: string
}

interface NodeDef {
  skill: string
  category: string
  color: string
  angle: number
  lift: number
}

/** One billboard texture per tech: a circular holo-coin (glass disc, glowing
 *  category rim, brand icon) with the name plate fused underneath. Draws a
 *  monogram immediately, swaps in the rasterized SVG icon when it loads. */
function makeBadgeTexture(skill: string, color: string) {
  const S = 3 // supersample for crisp text
  const disc = 64 * S
  const discR = disc / 2
  const gap = 7 * S
  const pillH = 26 * S
  const pillFont = `600 ${12.5 * S}px "Space Grotesk", "Inter", sans-serif`
  const pillPadX = 12 * S

  const measure = document.createElement('canvas').getContext('2d')!
  measure.font = pillFont
  const pillW = Math.ceil(measure.measureText(skill).width + pillPadX * 2)

  const w = Math.max(disc + 12 * S, pillW + 4 * S)
  const h = disc + gap + pillH + 6 * S
  const cx = w / 2
  const cy = discR + 3 * S

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  const drawBase = () => {
    ctx.clearRect(0, 0, w, h)

    // Glass disc
    const bg = ctx.createRadialGradient(cx, cy - discR * 0.35, discR * 0.1, cx, cy, discR)
    bg.addColorStop(0, 'rgba(30, 32, 56, 0.97)')
    bg.addColorStop(1, 'rgba(8, 9, 20, 0.97)')
    ctx.beginPath()
    ctx.arc(cx, cy, discR - 2 * S, 0, Math.PI * 2)
    ctx.fillStyle = bg
    ctx.fill()

    // Category rim with glow
    ctx.lineWidth = 2.5 * S
    ctx.strokeStyle = color
    ctx.shadowColor = color
    ctx.shadowBlur = 10 * S
    ctx.stroke()
    ctx.shadowBlur = 0

    // Faint inner ring for depth
    ctx.beginPath()
    ctx.arc(cx, cy, discR - 7 * S, 0, Math.PI * 2)
    ctx.lineWidth = S * 0.8
    ctx.strokeStyle = 'rgba(140, 150, 255, 0.22)'
    ctx.stroke()

    // Name plate
    const px = (w - pillW) / 2
    const py = disc + gap
    ctx.beginPath()
    ctx.roundRect(px, py, pillW, pillH, pillH / 2)
    ctx.fillStyle = 'rgba(8, 9, 20, 0.92)'
    ctx.fill()
    ctx.lineWidth = S * 0.8
    ctx.strokeStyle = `${color}99`
    ctx.stroke()

    ctx.font = pillFont
    ctx.fillStyle = '#eef0ff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(skill, cx, py + pillH / 2 + S)
  }

  const drawMono = () => {
    const words = skill.split(/[\s/]+/).filter(Boolean)
    const mono = (words.length > 1 ? words[0][0] + words[1][0] : skill.slice(0, 2)).toUpperCase()
    ctx.font = `700 ${24 * S}px "Space Grotesk", "Inter", sans-serif`
    ctx.fillStyle = '#eef0ff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(mono, cx, cy + S)
  }

  drawBase()
  drawMono()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4

  const Icon = SKILL_ICONS[skill]
  if (Icon) {
    const svg = renderToStaticMarkup(createElement(Icon, { color: '#eef0ff', size: 256 }))
    const img = new Image()
    img.onload = () => {
      drawBase()
      const iconSize = disc * 0.5
      ctx.drawImage(img, cx - iconSize / 2, cy - iconSize / 2, iconSize, iconSize)
      texture.needsUpdate = true
    }
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  }

  return { texture, aspect: w / h }
}

/* Orbit line with a comet pulse sweeping around it — alpha peaks at the
   tracer head and decays into a tail behind it. */
const ORBIT_VERT = /* glsl */ `
  attribute float aT;
  varying float vT;
  void main() {
    vT = aT;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const ORBIT_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uBase;
  uniform float uSpeed;
  uniform float uPhase;
  varying float vT;
  void main() {
    float d = fract(vT - uTime * uSpeed - uPhase);
    float pulse = exp(-d * 16.0);
    vec3 col = mix(uColor, vec3(1.0), pulse * 0.55);
    float alpha = uBase + pulse * uBase * 3.2;
    gl_FragColor = vec4(col, alpha);
  }
`

const BADGE_H = 1.5

function SkillBadge({
  def,
  radius,
  dimmed,
  onSelect,
  onHover,
}: {
  def: NodeDef
  radius: number
  dimmed: boolean
  onSelect: (sel: GalaxySelection) => void
  onHover: (sel: GalaxySelection | null) => void
}) {
  const ref = useRef<THREE.Sprite>(null)
  const [hovered, setHovered] = useState(false)

  const { material, aspect } = useMemo(() => {
    const { texture, aspect } = makeBadgeTexture(def.skill, def.color)
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false })
    return { material, aspect }
  }, [def.skill, def.color])

  useEffect(() => {
    return () => {
      material.map?.dispose()
      material.dispose()
    }
  }, [material])

  useFrame((state, delta) => {
    if (!ref.current) return
    const target = hovered ? BADGE_H * 1.3 : BADGE_H
    const next = ref.current.scale.y + (target - ref.current.scale.y) * Math.min(delta * 9, 1)
    ref.current.scale.set(next * aspect, next, 1)

    // Gentle bob so the field feels alive without tumbling
    ref.current.position.y = def.lift + Math.sin(state.clock.elapsedTime * 0.8 + def.angle * 5) * 0.08

    const mat = ref.current.material as THREE.SpriteMaterial
    const targetOpacity = dimmed ? 0.1 : 1
    mat.opacity += (targetOpacity - mat.opacity) * Math.min(delta * 7, 1)
  })

  const selection: GalaxySelection = { skill: def.skill, category: def.category, color: def.color }

  return (
    <sprite
      ref={ref}
      material={material}
      position={[Math.cos(def.angle) * radius, def.lift, Math.sin(def.angle) * radius]}
      scale={[BADGE_H * aspect, BADGE_H, 1]}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        onHover(selection)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        onHover(null)
        document.body.style.cursor = ''
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(selection)
      }}
    />
  )
}

function Ring({
  nodes,
  radius,
  tilt,
  speed,
  color,
  dimmed,
  onSelect,
  onHover,
}: {
  nodes: NodeDef[]
  radius: number
  tilt: [number, number, number]
  speed: number
  color: string
  dimmed: boolean
  onSelect: (sel: GalaxySelection) => void
  onHover: (sel: GalaxySelection | null) => void
}) {
  const spinner = useRef<THREE.Group>(null)
  const lineRef = useRef<THREE.LineLoop>(null)

  const orbitGeo = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const ts: number[] = []
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius))
      ts.push(i / 128)
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts)
    geo.setAttribute('aT', new THREE.Float32BufferAttribute(ts, 1))
    return geo
  }, [radius])

  const orbitMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ORBIT_VERT,
        fragmentShader: ORBIT_FRAG,
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uTime: { value: 0 },
          uBase: { value: 0.18 },
          uSpeed: { value: 0.022 + radius * 0.0016 },
          uPhase: { value: radius * 0.61 },
        },
        transparent: true,
        depthWrite: false,
      }),
    [color, radius],
  )

  useFrame((state, delta) => {
    if (spinner.current) spinner.current.rotation.y += delta * speed
    const mat = lineRef.current?.material as THREE.ShaderMaterial | undefined
    if (mat) {
      mat.uniforms.uTime.value = state.clock.elapsedTime
      const base = mat.uniforms.uBase
      base.value += ((dimmed ? 0.04 : 0.18) - base.value) * Math.min(delta * 7, 1)
    }
  })

  return (
    <group rotation={tilt}>
      <lineLoop ref={lineRef} geometry={orbitGeo} material={orbitMat} />
      <group ref={spinner}>
        {nodes.map((def) => (
          <SkillBadge
            key={def.skill}
            def={def}
            radius={radius}
            dimmed={dimmed}
            onSelect={onSelect}
            onHover={onHover}
          />
        ))}
      </group>
    </group>
  )
}

function Core() {
  const outer = useRef<THREE.Mesh>(null)
  useFrame((state, delta) => {
    if (outer.current) {
      outer.current.rotation.y += delta * 0.25
      outer.current.rotation.x += delta * 0.1
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.04
      outer.current.scale.setScalar(s)
    }
  })
  return (
    <group>
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color="#8b7bff" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshBasicMaterial color="#ff6535" transparent opacity={0.85} />
      </mesh>
      <pointLight intensity={6} distance={12} color="#ff8a5c" />
    </group>
  )
}

/* Gentle tilts keep every orbit legible — badges stay near the horizontal plane */
const TILTS: [number, number, number][] = [
  [0.1, 0, 0.05],
  [-0.16, 0.4, 0.1],
  [0.2, -0.3, -0.08],
  [-0.08, 0.9, 0.14],
  [0.24, 0.2, -0.16],
  [-0.2, -0.6, 0.07],
  [0.14, 1.2, 0.2],
]

export default function SkillsGalaxy({
  categories,
  activeCategory,
  onSelect,
  onHover,
}: {
  categories: GalaxyCategory[]
  activeCategory: string | null
  onSelect: (sel: GalaxySelection) => void
  onHover: (sel: GalaxySelection | null) => void
}) {
  const mobile = useIsMobile()

  const rings = useMemo(
    () =>
      categories.map((cat, i) => {
        const radius = 2.9 + i * 1.45
        const nodes: NodeDef[] = cat.skills.map((skill, j) => ({
          skill,
          category: cat.name,
          color: cat.color,
          angle: (j / cat.skills.length) * Math.PI * 2 + i * 0.7,
          // Alternate badges above/below the ring plane so neighbours don't collide
          lift: j % 2 === 0 ? 0.55 : -0.55,
        }))
        return { cat, radius, nodes, tilt: TILTS[i % TILTS.length], speed: 0.04 + 0.02 * (i % 3) }
      }),
    [categories],
  )

  return (
    <Canvas
      dpr={[1, mobile ? 1.5 : 1.75]}
      camera={{ position: [0, 5.5, mobile ? 24 : 19], fov: 48 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.4} />
      <Core />
      {rings.map(({ cat, radius, nodes, tilt, speed }) => (
        <Ring
          key={cat.name}
          nodes={nodes}
          radius={radius}
          tilt={tilt}
          speed={speed}
          color={cat.color}
          dimmed={activeCategory !== null && activeCategory !== cat.name}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
        minPolarAngle={Math.PI * 0.22}
        maxPolarAngle={Math.PI * 0.62}
      />
    </Canvas>
  )
}
