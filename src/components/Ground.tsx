import { RigidBody } from '@react-three/rapier'

/**
 * Chão do mundo — dividido em 9 tiles (grade 3x3) com tons levemente
 * diferentes de verde pastel. Isso quebra a monotonia de um plano único
 * e dá sensação de terreno orgânico sob a iluminação dourada.
 * RigidBody "fixed" garante que o jogador não caia infinitamente.
 */

/* Paleta de verdes pastel quentes — combinam com a iluminação sunset */
const TILE_COLORS = [
  '#6B8F5E', '#7A9B6A', '#5F8A52',
  '#72946B', '#689060', '#7DA070',
  '#618B55', '#769868', '#6A8D5D',
]

export default function Ground() {
  const tileSize = 34
  const offsets = [-1, 0, 1]

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <group>
        {offsets.map((x, xi) =>
          offsets.map((z, zi) => (
            <mesh
              key={`${xi}-${zi}`}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[x * tileSize, -0.01 + (xi + zi) * 0.002, z * tileSize]}
              receiveShadow
            >
              <planeGeometry args={[tileSize + 0.5, tileSize + 0.5]} />
              <meshStandardMaterial
                color={TILE_COLORS[xi * 3 + zi]}
                roughness={0.95}
              />
            </mesh>
          ))
        )}
      </group>
    </RigidBody>
  )
}
