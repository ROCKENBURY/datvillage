/**
 * Caminho de terra do vilarejo.
 * Usa um plano rotacionado para ficar no chão, com material de cor terra.
 * Sem colisão — o jogador pode andar livremente sobre ele.
 */

interface PathSegmentProps {
  position: [number, number, number]
  width?: number
  length?: number
  rotation?: [number, number, number]
}

function PathSegment({
  position,
  width = 2,
  length = 10,
  rotation = [0, 0, 0],
}: PathSegmentProps) {
  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2 + rotation[0], rotation[1], rotation[2]]}
      receiveShadow
    >
      <planeGeometry args={[width, length]} />
      <meshStandardMaterial color="#BFA47A" roughness={0.95} />
    </mesh>
  )
}

/**
 * Conjunto de caminhos que ligam as casas e a fonte central.
 * Cada segmento é posicionado manualmente para formar uma rede simples.
 */
export default function VillagePaths() {
  return (
    <group>
      {/* Caminho norte-sul — liga a entrada ao centro */}
      <PathSegment position={[0, 0.02, -5]} length={14} />

      {/* Caminho leste-oeste — cruza o centro */}
      <PathSegment position={[0, 0.02, 0]} width={2} length={14} rotation={[0, Math.PI / 2, 0]} />

      {/* Caminho diagonal para casa nordeste */}
      <PathSegment position={[5, 0.02, -5]} length={8} rotation={[0, Math.PI / 4, 0]} />

      {/* Caminho para a casa sul */}
      <PathSegment position={[-3, 0.02, 5]} length={8} rotation={[0, -Math.PI / 6, 0]} />
    </group>
  )
}
