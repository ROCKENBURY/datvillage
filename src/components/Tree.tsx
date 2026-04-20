import { RigidBody } from '@react-three/rapier'

/**
 * Árvore do vilarejo.
 * Tronco cilíndrico + copa esférica. Aceita rotationY para quebrar repetição
 * visual — cada árvore pode ficar ligeiramente diferente mesmo com a mesma mesh.
 * O collider "cuboid" aproxima a forma para colisão.
 */

interface TreeProps {
  position: [number, number, number]
  scale?: number
  crownColor?: string
  /** Rotação em Y (radianos) — varia a orientação pra evitar uniformidade */
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
        {/* Tronco — cilindro com tom quente de madeira */}
        <mesh position={[0, 1, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
          <meshStandardMaterial color="#7B5B3A" roughness={0.95} />
        </mesh>

        {/* Copa — esfera com flatShading pra aspecto low-poly estilizado */}
        <mesh position={[0, 2.5, 0]} castShadow>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color={crownColor} flatShading roughness={0.85} />
        </mesh>
      </group>
    </RigidBody>
  )
}
