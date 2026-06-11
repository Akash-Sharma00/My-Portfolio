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
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aPhase) + aPhase * 40.0);
    gl_PointSize = aScale * uPixelRatio * (160.0 / -mv.z);
  }
`

const STAR_FRAG = /* glsl */ `
  varying float vTwinkle;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float strength = pow(smoothstep(0.5, 0.0, d), 2.2);
    vec3 col = mix(vec3(0.75, 0.8, 1.0), vec3(1.0), strength);
    gl_FragColor = vec4(col, strength * vTwinkle);
  }
`

const NEBULA_VERT = /* glsl */ `
  attribute float aScale;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vPulse;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.08 + position.y * 0.4) * 0.6;
    p.y += cos(uTime * 0.06 + position.x * 0.3) * 0.6;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vColor = aColor;
    vPulse = 0.7 + 0.3 * sin(uTime * 0.25 + position.z);
    gl_PointSize = aScale * uPixelRatio * (220.0 / -mv.z);
  }
`

const NEBULA_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vPulse;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float strength = pow(smoothstep(0.5, 0.0, d), 3.5);
    gl_FragColor = vec4(vColor, strength * 0.16 * vPulse);
  }
`

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
  const pointer = useRef({ x: 0, y: 0 })

  const { starGeo, starMat, nebGeo, nebMat } = useMemo(() => {
    const uniforms = () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    })
    const starGeo = makeCloud(Math.floor(3800 * density), 26, 0.8, 2.6, false)
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
    starMat.uniforms.uTime.value = t
    nebMat.uniforms.uTime.value = t

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
    <group ref={group}>
      <points geometry={starGeo} material={starMat} />
      <points geometry={nebGeo} material={nebMat} />
    </group>
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
        dpr={[1, mobile ? 1.5 : 2]}
        camera={{ position: [0, 0, 11], fov: 58 }}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
      >
        <Scene density={mobile ? 0.45 : 1} />
      </Canvas>
    </div>
  )
}
