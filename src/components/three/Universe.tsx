import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useIsMobile, usePrefersReducedMotion } from '../../hooks/useMedia'

const STAR_VERT = /* glsl */ `
  attribute float aScale;
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vTwinkle;
  varying float vDim;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aPhase) + aPhase * 40.0);
    gl_PointSize = aScale * uPixelRatio * (160.0 / -mv.z);
    // Dim stars near screen center so foreground copy stays readable;
    // full brightness returns toward the viewport edges.
    vec2 ndc = gl_Position.xy / max(gl_Position.w, 0.0001);
    vDim = 0.32 + 0.68 * smoothstep(0.3, 1.05, length(ndc));
  }
`

const STAR_FRAG = /* glsl */ `
  varying float vTwinkle;
  varying float vDim;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float strength = pow(smoothstep(0.5, 0.0, d), 2.2);
    vec3 col = mix(vec3(0.75, 0.8, 1.0), vec3(1.0), strength);
    gl_FragColor = vec4(col, strength * vTwinkle * vDim);
  }
`

const NEBULA_VERT = /* glsl */ `
  attribute float aScale;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vPulse;
  varying float vDim;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.08 + position.y * 0.4) * 0.6;
    p.y += cos(uTime * 0.06 + position.x * 0.3) * 0.6;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vColor = aColor;
    vPulse = 0.7 + 0.3 * sin(uTime * 0.25 + position.z);
    gl_PointSize = aScale * uPixelRatio * (220.0 / -mv.z);
    vec2 ndc = gl_Position.xy / max(gl_Position.w, 0.0001);
    vDim = 0.25 + 0.75 * smoothstep(0.25, 1.1, length(ndc));
  }
`

const NEBULA_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vPulse;
  varying float vDim;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float strength = pow(smoothstep(0.5, 0.0, d), 3.5);
    gl_FragColor = vec4(vColor, strength * 0.1 * vPulse * vDim);
  }
`

const METEOR_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const METEOR_FRAG = /* glsl */ `
  uniform float uAlpha;
  varying vec2 vUv;
  void main() {
    float tail = smoothstep(0.0, 0.85, vUv.x);
    float edge = 1.0 - abs(vUv.y - 0.5) * 2.0;
    float a = pow(tail, 3.0) * edge * uAlpha;
    vec3 col = mix(vec3(0.55, 0.65, 1.0), vec3(1.0), pow(tail, 6.0));
    gl_FragColor = vec4(col, a);
  }
`

type Meteor = {
  t: number
  wait: number
  life: number
  dist: number
  origin: THREE.Vector3
  dir: THREE.Vector3
}

function respawnMeteor(m: Meteor, first = false) {
  m.t = 0
  m.wait = (first ? 1.5 : 2.5) + Math.random() * 7
  m.life = 0.9 + Math.random() * 0.5
  m.dist = 10 + Math.random() * 6
  m.origin.set((Math.random() - 0.5) * 26, 3 + Math.random() * 6, -6 + Math.random() * 4)
  m.dir.set(Math.random() > 0.5 ? 1 : -1, -(0.35 + Math.random() * 0.3), 0).normalize()
}

/** Occasional meteors streaking across the upper sky — three quads, additive blend. */
function ShootingStars() {
  const refs = useRef<(THREE.Mesh | null)[]>([])

  const { geo, meteors, mats } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(3.4, 0.05)
    const meteors: Meteor[] = Array.from({ length: 3 }, () => {
      const m: Meteor = {
        t: 0, wait: 0, life: 1, dist: 12,
        origin: new THREE.Vector3(),
        dir: new THREE.Vector3(),
      }
      respawnMeteor(m, true)
      return m
    })
    const mats = meteors.map(
      () =>
        new THREE.ShaderMaterial({
          vertexShader: METEOR_VERT,
          fragmentShader: METEOR_FRAG,
          uniforms: { uAlpha: { value: 0 } },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
    )
    return { geo, meteors, mats }
  }, [])

  useFrame((_, delta) => {
    meteors.forEach((m, i) => {
      const mesh = refs.current[i]
      if (!mesh) return
      m.t += delta
      const p = (m.t - m.wait) / m.life
      if (p < 0) {
        mesh.visible = false
        return
      }
      if (p >= 1) {
        respawnMeteor(m)
        mesh.visible = false
        return
      }
      mesh.visible = true
      mesh.position.copy(m.origin).addScaledVector(m.dir, p * m.dist)
      mesh.rotation.z = Math.atan2(m.dir.y, m.dir.x)
      mats[i].uniforms.uAlpha.value = Math.sin(p * Math.PI) * 0.9
    })
  })

  return (
    <>
      {meteors.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { refs.current[i] = el }}
          geometry={geo}
          material={mats[i]}
          visible={false}
        />
      ))}
    </>
  )
}

const NEBULA_PALETTE = [
  new THREE.Color('#8b7bff'),
  new THREE.Color('#4cd9ed'),
  new THREE.Color('#ff6535'),
  new THREE.Color('#3b3b8f'),
]

function makeCloud(count: number, spread: number, scaleMin: number, scaleMax: number, colored: boolean) {
  const positions = new Float32Array(count * 3)
  const scales = new Float32Array(count)
  const phases = new Float32Array(count)
  const colors = colored ? new Float32Array(count * 3) : null

  for (let i = 0; i < count; i++) {
    // Flattened ellipsoid distribution so depth layers read on screen
    const r = spread * Math.cbrt(Math.random())
    const theta = Math.random() * Math.PI * 2
    const y = (Math.random() - 0.5) * spread * 0.9
    positions[i * 3] = Math.cos(theta) * r
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = Math.sin(theta) * r - spread * 0.25
    scales[i] = scaleMin + Math.random() * (scaleMax - scaleMin)
    phases[i] = Math.random()
    if (colors) {
      const c = NEBULA_PALETTE[Math.floor(Math.random() * NEBULA_PALETTE.length)]
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
  geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
  if (colors) geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
  return geo
}

function Scene({ density }: { density: number }) {
  const group = useRef<THREE.Group>(null)
  const starRef = useRef<THREE.Points>(null)
  const nebRef = useRef<THREE.Points>(null)
  const pointer = useRef({ x: 0, y: 0 })

  const { starGeo, starMat, nebGeo, nebMat } = useMemo(() => {
    const uniforms = () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    })
    const starGeo = makeCloud(Math.floor(3000 * density), 26, 0.8, 2.4, false)
    const starMat = new THREE.ShaderMaterial({
      vertexShader: STAR_VERT,
      fragmentShader: STAR_FRAG,
      uniforms: uniforms(),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const nebGeo = makeCloud(Math.floor(420 * density), 20, 14, 40, true)
    const nebMat = new THREE.ShaderMaterial({
      vertexShader: NEBULA_VERT,
      fragmentShader: NEBULA_FRAG,
      uniforms: uniforms(),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    return { starGeo, starMat, nebGeo, nebMat }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const sm = starRef.current?.material as THREE.ShaderMaterial | undefined
    const nm = nebRef.current?.material as THREE.ShaderMaterial | undefined
    if (sm) sm.uniforms.uTime.value = t
    if (nm) nm.uniforms.uTime.value = t

    // Lerped mouse parallax
    pointer.current.x += (state.pointer.x - pointer.current.x) * Math.min(delta * 2.5, 1)
    pointer.current.y += (state.pointer.y - pointer.current.y) * Math.min(delta * 2.5, 1)

    if (group.current) {
      const doc = document.documentElement
      const max = Math.max(doc.scrollHeight - innerHeight, 1)
      const progress = Math.min(window.scrollY / max, 1)

      group.current.rotation.y = t * 0.012 + pointer.current.x * 0.12 + progress * Math.PI * 0.5
      group.current.rotation.x = pointer.current.y * 0.08 + progress * 0.25
      group.current.position.y = progress * 6
      group.current.position.z = Math.sin(progress * Math.PI) * 3
    }
  })

  return (
    <>
      <group ref={group}>
        <points ref={starRef} geometry={starGeo} material={starMat} />
        <points ref={nebRef} geometry={nebGeo} material={nebMat} />
      </group>
      {density >= 1 && <ShootingStars />}
    </>
  )
}

/** Fixed full-viewport canvas living behind every section. */
export default function Universe() {
  const mobile = useIsMobile()
  const reduced = usePrefersReducedMotion()

  if (reduced) {
    return (
      <div
        className="universe-canvas"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(139,123,255,0.12), transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(255,101,53,0.08), transparent 55%)',
        }}
      />
    )
  }

  return (
    <div className="universe-canvas">
      <Canvas
        dpr={[1, mobile ? 1.5 : 1.75]}
        camera={{ position: [0, 0, 11], fov: 58 }}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
      >
        <Scene density={mobile ? 0.45 : 1} />
      </Canvas>
    </div>
  )
}
