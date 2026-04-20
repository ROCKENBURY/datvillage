import { useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useInteractionStore } from '../store/interactionStore'
import FountainWater from './FountainWater'

/**
 * Fonte de água interativa no centro do vilarejo.
 *
 * Ao pressionar E perto da fonte:
 * 1. Toca som de água gerado pela Web Audio API (ruído branco filtrado)
 * 2. Intensifica a ondulação da água e névoa por 3 segundos
 *
 * A água agora usa shader customizado com ondulação, reflexo do céu e specular.
 */

interface FountainProps {
  position: [number, number, number]
}

/**
 * Gera som de água usando Web Audio API.
 * Ruído branco filtrado com lowpass, envelope de 3 segundos.
 */
function playWaterSound() {
  const ctx = new AudioContext()

  const bufferSize = ctx.sampleRate * 3
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  const source = ctx.createBufferSource()
  source.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 800

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.2)
  gain.gain.setValueAtTime(0.3, ctx.currentTime + 2.5)
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 3)

  source.connect(filter).connect(gain).connect(ctx.destination)
  source.start()
  source.stop(ctx.currentTime + 3)

  source.onended = () => ctx.close()
}

export default function Fountain({ position }: FountainProps) {
  const mistRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  const activateFountain = useInteractionStore((s) => s.activateFountain)

  const handleInteract = useCallback(() => {
    playWaterSound()
    activateFountain()
  }, [activateFountain])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const isActive = useInteractionStore.getState().fountainActive
    const intensity = isActive ? 2.5 : 1

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
        userData={{
          interactive: true,
          interactiveName: 'fonte',
          onInteract: handleInteract,
        }}
      >
        {/* Base da fonte — pedra com tom quente */}
        <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[1.2, 1.4, 0.6, 16]} />
          <meshStandardMaterial color="#A8998A" roughness={0.85} metalness={0} />
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

        {/* Água com shader customizado — ondulação, reflexo e specular */}
        <FountainWater yPosition={0.55} radius={1.05} />

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
