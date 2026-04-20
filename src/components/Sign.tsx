import { useRef, useCallback } from 'react'
import * as THREE from 'three'
import { useInteractionStore } from '../store/interactionStore'

/**
 * Placa de madeira interativa.
 *
 * Composta por um poste cilíndrico e uma placa retangular (BoxGeometry fino).
 * Ao pressionar E, exibe caixa de diálogo com o texto configurado.
 * Marcada com userData.interactive para o InteractionSystem.
 */

interface SignProps {
  position: [number, number, number]
  /** Texto exibido no diálogo ao interagir */
  text: string
  /** Rotação em Y (radianos) — orienta a placa para o jogador */
  rotationY?: number
}

export default function Sign({ position, text, rotationY = 0 }: SignProps) {
  const groupRef = useRef<THREE.Group>(null)

  const openDialog = useInteractionStore((s) => s.openDialog)

  /* Ao interagir, abre diálogo com o texto desta placa */
  const handleInteract = useCallback(() => {
    openDialog(text)
  }, [text, openDialog])

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group
        ref={groupRef}
        userData={{
          interactive: true,
          interactiveName: 'placa',
          onInteract: handleInteract,
        }}
      >
        {/* Poste — cilindro fino de madeira escura */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 1, 6]} />
          <meshStandardMaterial color="#5D4037" roughness={0.95} />
        </mesh>

        {/* Placa — retângulo fino de madeira clara */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <boxGeometry args={[0.8, 0.45, 0.05]} />
          <meshStandardMaterial color="#A1887F" roughness={0.9} />
        </mesh>

        {/* Borda superior da placa — detalhe decorativo */}
        <mesh position={[0, 1.35, 0]} castShadow>
          <boxGeometry args={[0.85, 0.04, 0.06]} />
          <meshStandardMaterial color="#6D4C41" roughness={0.9} />
        </mesh>
      </group>
    </group>
  )
}
