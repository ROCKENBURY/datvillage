import { useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useInteractionStore } from '../store/interactionStore'

/**
 * Fonte de água interativa no centro do vilarejo.
 *
 * Ao pressionar E perto da fonte:
 * 1. Toca som de água gerado pela Web Audio API (ruído branco filtrado)
 * 2. Intensifica a animação da água e névoa por 3 segundos
 *
 * O som NÃO loopa — toca por 3s e para automaticamente.
 */

interface FountainProps {
  position: [number, number, number]
}

/**
 * Gera som de água usando Web Audio API.
 * Cria ruído branco, filtra com lowpass para soar como água corrente,
 * e aplica envelope de volume (fade in/out) durante 3 segundos.
 */
function playWaterSound() {
  const ctx = new AudioContext()

  /* Buffer de ruído branco — 3 segundos */
  const bufferSize = ctx.sampleRate * 3
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  const source = ctx.createBufferSource()
  source.buffer = buffer

  /* Filtro lowpass — suaviza o ruído pra soar como água */
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 800

  /* Controle de volume com envelope suave */
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.2)
  gain.gain.setValueAtTime(0.3, ctx.currentTime + 2.5)
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 3)

  source.connect(filter).connect(gain).connect(ctx.destination)
  source.start()
  source.stop(ctx.currentTime + 3)

  /* Limpa contexto de áudio após terminar */
  source.onended = () => ctx.close()
}

export default function Fountain({ position }: FountainProps) {
  const waterRef = useRef<THREE.Mesh>(null)
  const mistRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  const activateFountain = useInteractionStore((s) => s.activateFountain)

  /* Callback de interação — toca som e ativa efeito visual */
  const handleInteract = useCallback(() => {
    playWaterSound()
    activateFountain()
  }, [activateFountain])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const isActive = useInteractionStore.getState().fountainActive

    /* Multiplicador de intensidade — normal vs. ativado */
    const intensity = isActive ? 2.5 : 1

    /* Água pulsa — mais intensamente quando ativada */
    if (waterRef.current) {
      waterRef.current.scale.y = 1 + Math.sin(t * 2 * intensity) * 0.1 * intensity
      waterRef.current.position.y = 0.6 + Math.sin(t * 2 * intensity) * 0.05 * intensity

      /* Muda opacidade quando ativada — água fica mais "viva" */
      const mat = waterRef.current.material as THREE.MeshStandardMaterial
      mat.opacity = isActive ? 0.7 : 0.45
      mat.emissiveIntensity = isActive ? 0.25 : 0.08
    }

    /* Névoa gira — mais rápido e visível quando ativada */
    if (mistRef.current) {
      mistRef.current.rotation.z = t * 0.15 * intensity
      const mat = mistRef.current.material as THREE.MeshStandardMaterial
      mat.opacity = isActive
        ? 0.25 + Math.sin(t * 1.5) * 0.08
        : 0.12 + Math.sin(t * 0.8) * 0.05
    }
  })

  return (
    <RigidBody type="fixed" colliders="cuboid" position={position}>
      <group
        ref={groupRef}
        /* Marca a fonte inteira como interativa */
        userData={{
          interactive: true,
          interactiveName: 'fonte',
          onInteract: handleInteract,
        }}
      >
        {/* Base da fonte — pedra com tom quente */}
        <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[1.2, 1.4, 0.6, 16]} />
          <meshStandardMaterial color="#A8998A" roughness={0.9} />
        </mesh>

        {/* Borda elevada da fonte */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <torusGeometry args={[1.2, 0.12, 8, 24]} />
          <meshStandardMaterial color="#8D7B6B" roughness={0.85} />
        </mesh>

        {/* Pilar central */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.2, 1.2, 8]} />
          <meshStandardMaterial color="#BEB0A0" roughness={0.8} />
        </mesh>

        {/* Água — tom dourado translúcido com emissão que intensifica ao interagir */}
        <mesh ref={waterRef} position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshStandardMaterial
            color="#7EC8E3"
            emissive="#FFD180"
            emissiveIntensity={0.08}
            transparent
            opacity={0.45}
            roughness={0.2}
          />
        </mesh>

        {/* Névoa de chão — plano circular que gira ao redor da fonte */}
        <mesh
          ref={mistRef}
          position={[0, 0.08, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[3.5, 32]} />
          <meshStandardMaterial
            color="#E8DFD0"
            transparent
            opacity={0.12}
            depthWrite={false}
          />
        </mesh>
      </group>
    </RigidBody>
  )
}
