import { RigidBody } from '@react-three/rapier'
import Door from './Door'

/**
 * Casa do vilarejo — materiais refinados.
 * Paredes: roughness 0.9, metalness 0 (mate, reboco orgânico).
 * Telhado: roughness 0.7, metalness 0 (telha cerâmica levemente lisa).
 */

interface HouseProps {
  position: [number, number, number]
  roofColor?: string
  wallColor?: string
  scale?: number
  scaleY?: number
  rotationY?: number
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
        {/* Paredes — mate, orgânico */}
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color={wallColor} roughness={0.9} metalness={0} />
        </mesh>

        {/* Telhado — telha cerâmica, levemente mais liso */}
        <mesh position={[0, 2.6, 0]} castShadow>
          <coneGeometry args={[1.8, 1.2, 4]} />
          <meshStandardMaterial color={roofColor} roughness={0.7} metalness={0} />
        </mesh>

        <Door position={[0, 0.5, 1.01]} />

        {/* Chaminé */}
        {chimney && (
          <mesh position={[0.6, 3.2, -0.5]} castShadow>
            <cylinderGeometry args={[0.12, 0.15, 0.6, 6]} />
            <meshStandardMaterial color="#6D4C41" roughness={0.95} metalness={0} />
          </mesh>
        )}

        {/* Janela esquerda */}
        <mesh position={[-0.6, 1.3, 1.01]}>
          <boxGeometry args={[0.35, 0.35, 0.05]} />
          <meshStandardMaterial color="#FFD54F" emissive="#FFD54F" emissiveIntensity={0.15} />
        </mesh>

        {/* Janela direita */}
        <mesh position={[0.6, 1.3, 1.01]}>
          <boxGeometry args={[0.35, 0.35, 0.05]} />
          <meshStandardMaterial color="#FFD54F" emissive="#FFD54F" emissiveIntensity={0.15} />
        </mesh>
      </group>
    </RigidBody>
  )
}
