import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Partículas de pólen/poeira dourada flutuando no ar.
 *
 * ~200 pontos pequenos espalhados num volume grande ao redor do vilarejo.
 * Cada partícula sobe lentamente e oscila com sin/cos para parecer
 * que flutua ao vento. Cor dourada (#FFE4B5) para combinar com golden hour.
 *
 * Usa THREE.Points com BufferGeometry para performance.
 */

const PARTICLE_COUNT = 200
const VOLUME_X = 60   // largura do volume
const VOLUME_Y = 15   // altura do volume
const VOLUME_Z = 60   // profundidade do volume

/** Gerador determinístico — mesma distribuição sempre */
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s + 0x6D2B79F5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function DustParticles() {
  const pointsRef = useRef<THREE.Points>(null)

  /* Gera posições iniciais e offsets de fase (pra cada partícula oscilar diferente) */
  const { positions, phases } = useMemo(() => {
    const rng = seededRandom(123)
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const ph = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (rng() - 0.5) * VOLUME_X
      pos[i * 3 + 1] = rng() * VOLUME_Y + 1
      pos[i * 3 + 2] = (rng() - 0.5) * VOLUME_Z
      ph[i] = rng() * Math.PI * 2
    }

    return { positions: pos, phases: ph }
  }, [])

  /* A cada frame, atualiza posição de cada partícula — subida + oscilação */
  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const t = clock.getElapsedTime()
    const geo = pointsRef.current.geometry
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phase = phases[i]
      const i3 = i * 3

      /* Oscilação horizontal suave — simula flutuação ao vento */
      posAttr.array[i3] = positions[i3] + Math.sin(t * 0.3 + phase) * 1.5
      posAttr.array[i3 + 2] = positions[i3 + 2] + Math.cos(t * 0.25 + phase) * 1.2

      /* Subida lenta com wrap — quando chega no topo, volta pra baixo */
      let y = positions[i3 + 1] + ((t * 0.2 + phase) % VOLUME_Y)
      if (y > VOLUME_Y + 1) y -= VOLUME_Y
      posAttr.array[i3 + 1] = y
    }

    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FFE4B5"
        size={0.04}
        transparent
        opacity={0.6}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}
