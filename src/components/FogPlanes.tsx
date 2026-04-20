import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Neblina volumétrica simulada com planos semi-transparentes.
 *
 * 4 planos grandes com textura de ruído procedural posicionados
 * a diferentes alturas (1–3 unidades do chão). Movem-se lentamente
 * na horizontal, simulando bancos de neblina de fim de tarde.
 */

/** Gera textura de ruído suave via Canvas — simula nuvem/neblina */
function generateFogTexture(size = 128): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const imageData = ctx.getImageData(0, 0, size, size)
  const data = imageData.data

  /* Ruído suave com múltiplas camadas de seno — simula padrão de nuvem */
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4

      const n1 = Math.sin(x * 0.03) * Math.cos(y * 0.04) * 0.5 + 0.5
      const n2 = Math.sin(x * 0.07 + y * 0.05) * 0.3 + 0.5
      const n3 = Math.cos(x * 0.02 - y * 0.03) * 0.2 + 0.5

      const noise = (n1 + n2 + n3) / 3

      /* Cor creme clara */
      data[i] = 240
      data[i + 1] = 230
      data[i + 2] = 215
      /* Alpha baseado no ruído — cria forma orgânica de nuvem */
      data[i + 3] = noise * 100
    }
  }

  ctx.putImageData(imageData, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

/* Configuração dos 4 planos de neblina — alturas e velocidades variadas */
const FOG_LAYERS = [
  { y: 1.0, z: -5, scale: 30, speed: 0.15, opacity: 0.08 },
  { y: 1.8, z: 3, scale: 25, speed: -0.1, opacity: 0.06 },
  { y: 2.5, z: -8, scale: 35, speed: 0.08, opacity: 0.05 },
  { y: 1.3, z: 7, scale: 28, speed: -0.12, opacity: 0.07 },
]

export default function FogPlanes() {
  const groupRef = useRef<THREE.Group>(null)
  const fogTexture = useMemo(() => generateFogTexture(), [])

  /* Move os planos lentamente na horizontal — efeito de neblina à deriva */
  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()

    groupRef.current.children.forEach((child, i) => {
      const layer = FOG_LAYERS[i]
      child.position.x = Math.sin(t * layer.speed) * 8
    })
  })

  return (
    <group ref={groupRef}>
      {FOG_LAYERS.map((layer, i) => (
        <mesh
          key={i}
          position={[0, layer.y, layer.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[layer.scale, layer.scale]} />
          <meshBasicMaterial
            map={fogTexture}
            transparent
            opacity={layer.opacity}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}
