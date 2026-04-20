import { useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Porta interativa de uma casa.
 *
 * Ao pressionar E, a porta rotaciona 90° em Y (abre/fecha).
 * A animação usa lerp suave (~0.4s a 60fps).
 * O pivot é posicionado na borda da porta para girar como dobradiça.
 *
 * Marca-se com userData.interactive para o InteractionSystem detectar.
 */

interface DoorProps {
  /** Posição relativa dentro do group da casa */
  position: [number, number, number]
}

export default function Door({ position }: DoorProps) {
  const groupRef = useRef<THREE.Group>(null)
  const isOpen = useRef(false)
  const targetRotation = useRef(0)
  const currentRotation = useRef(0)

  /* Callback chamado pelo InteractionSystem quando jogador pressiona E */
  const handleInteract = useCallback(() => {
    isOpen.current = !isOpen.current
    targetRotation.current = isOpen.current ? -Math.PI / 2 : 0
  }, [])

  /* Lerp suave da rotação — ~8% por frame a 60fps ≈ 0.4s para completar */
  useFrame(() => {
    if (!groupRef.current) return
    currentRotation.current = THREE.MathUtils.lerp(
      currentRotation.current,
      targetRotation.current,
      0.08
    )
    groupRef.current.rotation.y = currentRotation.current
  })

  return (
    /* Pivot na borda esquerda da porta — simula dobradiça */
    <group position={[position[0] - 0.25, position[1], position[2]]}>
      <group
        ref={groupRef}
        /* Marca como interativo para o raycaster encontrar */
        userData={{
          interactive: true,
          interactiveName: 'porta',
          onInteract: handleInteract,
        }}
      >
        {/* Porta em si — deslocada do pivot para girar na borda */}
        <mesh position={[0.25, 0, 0]} castShadow>
          <boxGeometry args={[0.5, 1, 0.08]} />
          <meshStandardMaterial color="#4E342E" roughness={0.95} />
        </mesh>

        {/* Maçaneta — esfera pequena dourada */}
        <mesh position={[0.42, 0, 0.05]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#C9A54E" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </group>
  )
}
