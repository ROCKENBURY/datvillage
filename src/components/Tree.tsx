import { RigidBody } from '@react-three/rapier'

/**
 * Árvore do vilarejo — materiais refinados.
 * Tronco: roughness 0.95 (casca de árvore).
 * Copa: roughness 0.8, flatShading (low-poly estilizado).
 */

interface TreeProps {
  position: [number, number, number]
  scale?: number
  crownColor?: string
  rotationY?: number
}

export default function Tree({
  position,
  scale = 1,
  crownColor = '#4A7C3F',
  rotationY = 0,
}: TreeProps) {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={position}>
      <group scale={scale} rotation={[0, rotationY, 0]}>
        {/* Tronco — casca rugosa */}
        <mesh position={[0, 1, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
          <meshStandardMaterial color="#7B5B3A" roughness={0.95} metalness={0} />
        </mesh>

        {/* Copa — folhagem low-poly */}
        <mesh position={[0, 2.5, 0]} castShadow>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color={crownColor} flatShading roughness={0.8} metalness={0} />
        </mesh>
      </group>
    </RigidBody>
  )
}
