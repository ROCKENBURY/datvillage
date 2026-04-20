import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTimeStore } from '../store/timeStore'

/**
 * Vaga-lumes que aparecem ao anoitecer.
 *
 * ~15 pontos luminosos amarelos flutuando devagar a 0.5–2m de altura.
 * Cada vaga-lume tem uma esfera emissiva pequena + PointLight de baixa
 * intensidade. Ativam quando timeOfDay > 0.85 ou < 0.15 (noite).
 * Fade in/out suave na transição.
 */

const FIREFLY_COUNT = 15

/* Gerador determinístico */
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s + 0x6D2B79F5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* Posições base e fases — determinísticas pra consistência */
function generateFireflyData() {
  const rng = seededRandom(999)
  const data: { basePos: [number, number, number]; phase: number; speed: number }[] = []

  for (let i = 0; i < FIREFLY_COUNT; i++) {
    data.push({
      basePos: [(rng() - 0.5) * 24, 0.5 + rng() * 1.5, (rng() - 0.5) * 24],
      phase: rng() * Math.PI * 2,
      speed: 0.3 + rng() * 0.5,
    })
  }
  return data
}

const FIREFLY_DATA = generateFireflyData()

export default function Fireflies() {
  const groupRef = useRef<THREE.Group>(null)
  const timeOfDay = useTimeStore((s) => s.timeOfDay)

  /* Calcula visibilidade — fade suave na transição dia/noite */
  const visibility = useMemo(() => {
    if (timeOfDay > 0.9 || timeOfDay < 0.1) return 1
    if (timeOfDay > 0.85) return (timeOfDay - 0.85) / 0.05
    if (timeOfDay < 0.15) return (0.15 - timeOfDay) / 0.05
    return 0
  }, [timeOfDay])

  /* Não renderiza de dia — performance */
  const isNight = visibility > 0

  useFrame(({ clock }) => {
    if (!groupRef.current || !isNight) return
    const t = clock.getElapsedTime()

    groupRef.current.children.forEach((child, i) => {
      const data = FIREFLY_DATA[i]

      /* Flutuação suave — oscila em todas as direções */
      child.position.x = data.basePos[0] + Math.sin(t * data.speed + data.phase) * 1.5
      child.position.y = data.basePos[1] + Math.sin(t * data.speed * 0.7 + data.phase) * 0.5
      child.position.z = data.basePos[2] + Math.cos(t * data.speed * 0.8 + data.phase) * 1.2

      /* Pulsação de brilho — cada vaga-lume pisca independentemente */
      const pulse = 0.5 + Math.sin(t * 2 + data.phase * 3) * 0.5
      child.scale.setScalar(pulse * visibility)
    })
  })

  if (!isNight) return null

  return (
    <group ref={groupRef}>
      {FIREFLY_DATA.map((data, i) => (
        <group key={i} position={data.basePos}>
          {/* Esfera emissiva — corpo luminoso do vaga-lume */}
          <mesh>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshStandardMaterial
              color="#FFE082"
              emissive="#FFE082"
              emissiveIntensity={2}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Luz pontual — ilumina sutilmente ao redor */}
          <pointLight
            color="#FFE082"
            intensity={0.3 * visibility}
            distance={2}
            decay={2}
          />
        </group>
      ))}
    </group>
  )
}
