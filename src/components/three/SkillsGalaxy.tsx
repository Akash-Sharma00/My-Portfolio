import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
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
  ringIndex: number
  angle: number
}

/** Paint a glass chip label onto a canvas and wrap it as a sprite texture. */
function makeChipTexture(text: string, color: string) {
  const scale = 4
  const font = `600 ${13 * scale}px "Space Grotesk", "Inter", sans-serif`
  const padX = 14 * scale
  const padY = 9 * scale

  const measure = document.createElement('canvas').getContext('2d')!
  measure.font = font
  const textW = measure.measureText(text).width
  const w = Math.ceil(textW + padX * 2)
  const h = Math.ceil(13 * scale + padY * 2)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  const r = h / 2

  ctx.beginPath()
  ctx.roundRect(scale, scale, w - scale * 2, h - scale * 2, r)
  ctx.fillStyle = 'rgba(10, 11, 24, 0.92)'
  ctx.fill()
  ctx.lineWidth = scale
  ctx.strokeStyle = color
  ctx.shadowColor = color
  ctx.shadowBlur = 6 * scale
  ctx.stroke()
  ctx.shadowBlur = 0

  ctx.font = font
  ctx.fillStyle = '#eef0ff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, w / 2, h / 2 + scale)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return { texture, aspect: w / h }
}

function SkillNode({
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
    const { texture, aspect } = makeChipTexture(def.skill, def.color)
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    })
    return { material, aspect }
  }, [def.skill, def.color])

  useEffect(() => {
    return () => {
      material.map?.dispose()
      material.dispose()
    }
  }, [material])

  useFrame((_, delta) => {
    if (!ref.current) return
    const base = 0.62
    const target = hovered ? base * 1.45 : base
    const cur = ref.current.scale.y
    const next = cur + (target - cur) * Math.min(delta * 9, 1)
    ref.current.scale.set(next * aspect, next, 1)
    const targetOpacity = dimmed ? 0.14 : 1
    material.opacity += (targetOpacity - material.opacity) * Math.min(delta * 7, 1)
  })

  const selection: GalaxySelection = { skill: def.skill, category: def.category, color: def.color }

  return (
    <sprite
      ref={ref}
      material={material}
      position={[Math.cos(def.angle) * radius, 0, Math.sin(def.angle) * radius]}
      scale={[0.62 * aspect, 0.62, 1]}
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

  const orbitGeo = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius))
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [radius])

  const orbitMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity: 0.18,
      }),
    [color],
  )

  useFrame((_, delta) => {
    if (spinner.current) spinner.current.rotation.y += delta * speed
    orbitMat.opacity += ((dimmed ? 0.04 : 0.18) - orbitMat.opacity) * Math.min(delta * 7, 1)
  })

  return (
    <group rotation={tilt}>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <lineLoop geometry={orbitGeo} material={orbitMat} />
      <group ref={spinner}>
        {nodes.map((def) => (
          <SkillNode
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

const TILTS: [number, number, number][] = [
  [0.18, 0, 0.1],
  [-0.34, 0.4, 0.22],
  [0.5, -0.3, -0.18],
  [-0.14, 0.9, 0.34],
  [0.66, 0.2, -0.42],
  [-0.5, -0.6, 0.12],
  [0.3, 1.2, 0.5],
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
        const radius = 2.6 + i * 1.18
        const nodes: NodeDef[] = cat.skills.map((skill, j) => ({
          skill,
          category: cat.name,
          color: cat.color,
          ringIndex: i,
          angle: (j / cat.skills.length) * Math.PI * 2 + i * 0.7,
        }))
        return { cat, radius, nodes, tilt: TILTS[i % TILTS.length], speed: 0.05 + 0.025 * (i % 3) }
      }),
    [categories],
  )

  return (
    <Canvas
      dpr={[1, mobile ? 1.5 : 2]}
      camera={{ position: [0, 4.5, 12.5], fov: 50 }}
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
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI * 0.25}
        maxPolarAngle={Math.PI * 0.7}
      />
    </Canvas>
  )
}
