import { RigidBody } from '@react-three/rapier'
import Door from './Door'

/**
 * Casa do vilarejo.
 * Recebe posição, cor do telhado, escala e rotação Y para variar orientação.
 * A porta agora é um componente separado (Door) com interação própria.
 * O RigidBody "fixed" garante colisão sólida — o jogador não atravessa a casa.
 */

interface HouseProps {
  position: [number, number, number]
  roofColor?: string
  wallColor?: string
  scale?: number
  scaleY?: number
  rotationY?: number
  /** Adiciona chaminé no topo da casa (para fumaça) */
  chimney?: boolean
}

export default function House({
  position,
  roofColor = '#8B4513',
  wallColor = '#F5DEB3',
  scale = 1,
  scaleY = 1,
  rotationY = 0,
  chimney = false,
}: HouseProps) {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={position}>
      <group scale={[scale, scale * scaleY, scale]} rotation={[0, rotationY, 0]}>
        {/* Paredes — cubo com roughness alto para visual rústico de reboco */}
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} />
        </mesh>

        {/* Telhado — cone com material levemente brilhante (telha cerâmica) */}
        <mesh position={[0, 2.6, 0]} castShadow>
          <coneGeometry args={[1.8, 1.2, 4]} />
          <meshStandardMaterial color={roofColor} roughness={0.7} />
        </mesh>

        {/* Porta interativa — componente separado com animação de abrir/fechar */}
        <Door position={[0, 0.5, 1.01]} />

        {/* Chaminé — cilindro pequeno no topo do telhado */}
        {chimney && (
          <mesh position={[0.6, 3.2, -0.5]} castShadow>
            <cylinderGeometry args={[0.12, 0.15, 0.6, 6]} />
            <meshStandardMaterial color="#6D4C41" roughness={0.95} />
          </mesh>
        )}

        {/* Janela esquerda — vidro com leve brilho dourado (luz interna) */}
        <mesh position={[-0.6, 1.3, 1.01]}>
          <boxGeometry args={[0.35, 0.35, 0.05]} />
          <meshStandardMaterial color="#FFD54F" emissive="#FFD54F" emissiveIntensity={0.15} />
        </mesh>

        {/* Janela direita — mesma iluminação interna */}
        <mesh position={[0.6, 1.3, 1.01]}>
          <boxGeometry args={[0.35, 0.35, 0.05]} />
          <meshStandardMaterial color="#FFD54F" emissive="#FFD54F" emissiveIntensity={0.15} />
        </mesh>
      </group>
    </RigidBody>
  )
}
