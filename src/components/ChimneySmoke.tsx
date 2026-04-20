import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Fumaça saindo de uma chaminé.
 *
 * ~50 partículas por chaminé que sobem, crescem e desaparecem.
 * Cada partícula tem ciclo de vida: nasce pequena na base da chaminé,
 * sobe, aumenta de tamanho (dispersa) e gradualmente fica transparente.
 *
 * Usa THREE.Points com animação manual de posição/tamanho.
 */

const SMOKE_COUNT = 50

interface ChimneySmokeProps {
  /** Posição da chaminé no mundo */
  position: [number, number, number]
}

/** Gerador determinístico pra distribuição uniforme das partículas */
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s + 0x6D2B79F5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function ChimneySmoke({ position }: ChimneySmokeProps) {
  const pointsRef = useRef<THREE.Points>(null)

  /* Gera offsets de fase — cada partícula começa em ponto diferente do ciclo */
  const { phases, speeds } = useMemo(() => {
    const rng = seededRandom(position[0] * 100 + position[2])
    const ph = new Float32Array(SMOKE_COUNT)
    const sp = new Float32Array(SMOKE_COUNT)

    for (let i = 0; i < SMOKE_COUNT; i++) {
      ph[i] = rng() * Math.PI * 2
      sp[i] = 0.3 + rng() * 0.4
    }

    return { phases: ph, speeds: sp }
  }, [position])

  /* Buffer de posições — atualizado a cada frame */
  const positions = useMemo(() => new Float32Array(SMOKE_COUNT * 3), [])
  const sizes = useMemo(() => new Float32Array(SMOKE_COUNT), [])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const t = clock.getElapsedTime()
    const geo = pointsRef.current.geometry
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute
    const sizeAttr = geo.getAttribute('size') as THREE.BufferAttribute

    for (let i = 0; i < SMOKE_COUNT; i++) {
      /* Ciclo de vida da partícula (0–1): nasce, sobe, morre */
      const life = ((t * speeds[i] + phases[i]) % 3) / 3
      const i3 = i * 3

      /* Posição: sobe com dispersão lateral */
      posAttr.array[i3] = Math.sin(phases[i] + t * 0.5) * life * 0.8
      posAttr.array[i3 + 1] = life * 4
      posAttr.array[i3 + 2] = Math.cos(phases[i] + t * 0.3) * life * 0.6

      /* Tamanho: cresce conforme sobe (dispersão) */
      sizeAttr.array[i] = life * 0.15
    }

    posAttr.needsUpdate = true
    sizeAttr.needsUpdate = true

    /* Opacidade diminui pra partículas altas — fade out global */
    const mat = pointsRef.current.material as THREE.PointsMaterial
    mat.opacity = 0.25
  })

  return (
    <group position={position}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[sizes, 1]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#C8C0B0"
          transparent
          opacity={0.25}
          depthWrite={false}
          sizeAttenuation
          size={0.1}
        />
      </points>
    </group>
  )
}
