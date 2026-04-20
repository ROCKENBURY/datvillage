import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Silhuetas de pássaros voando em círculos no céu.
 *
 * 5 pontos pretos voando em órbitas circulares a diferentes alturas
 * e raios. Simula pássaros distantes ao entardecer — puramente visual.
 * Cada pássaro tem velocidade e raio diferentes para não parecer uniforme.
 */

/* Configuração dos 5 pássaros — raio, altura, velocidade e fase */
const BIRD_CONFIG = [
  { radius: 18, height: 22, speed: 0.3, phase: 0 },
  { radius: 22, height: 25, speed: 0.25, phase: 1.2 },
  { radius: 15, height: 20, speed: 0.35, phase: 2.5 },
  { radius: 25, height: 28, speed: 0.2, phase: 4.0 },
  { radius: 20, height: 23, speed: 0.28, phase: 5.5 },
]

export default function Birds() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()

    groupRef.current.children.forEach((bird, i) => {
      const cfg = BIRD_CONFIG[i]
      const angle = t * cfg.speed + cfg.phase

      /* Órbita circular com leve oscilação vertical */
      bird.position.x = Math.cos(angle) * cfg.radius
      bird.position.z = Math.sin(angle) * cfg.radius
      bird.position.y = cfg.height + Math.sin(t * 0.5 + cfg.phase) * 1.5
    })
  })

  return (
    <group ref={groupRef}>
      {BIRD_CONFIG.map((_, i) => (
        <mesh key={i} position={[0, 25, 0]}>
          {/* Forma de "V" achatado — dois triângulos espelhados simulam asas */}
          <group>
            {/* Asa esquerda */}
            <mesh rotation={[0, 0, 0.3]} position={[-0.15, 0, 0]}>
              <planeGeometry args={[0.3, 0.06]} />
              <meshBasicMaterial color="#1A1A1A" side={THREE.DoubleSide} />
            </mesh>
            {/* Asa direita */}
            <mesh rotation={[0, 0, -0.3]} position={[0.15, 0, 0]}>
              <planeGeometry args={[0.3, 0.06]} />
              <meshBasicMaterial color="#1A1A1A" side={THREE.DoubleSide} />
            </mesh>
          </group>
        </mesh>
      ))}
    </group>
  )
}
