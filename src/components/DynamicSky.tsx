import { useMemo } from 'react'
import { Sky, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useTimeStore } from '../store/timeStore'

/**
 * Céu dinâmico com ciclo dia/noite.
 *
 * Calcula posição do sol, cor da luz direcional, cor da ambient e fog
 * tudo a partir de timeOfDay (0–1). Transições suaves via interpolação
 * de cores e posições — sem saltos bruscos.
 *
 * Também exibe estrelas quando timeOfDay indica noite (>0.88 ou <0.08).
 */

/**
 * Interpola entre duas cores hex com fator t (0–1).
 * Usa espaço linear RGB pra evitar artefatos de interpolação.
 */
function lerpColor(a: string, b: string, t: number): THREE.Color {
  const ca = new THREE.Color(a)
  const cb = new THREE.Color(b)
  return ca.lerp(cb, t)
}

/**
 * Calcula a posição do sol no céu a partir de timeOfDay.
 * O sol percorre um arco: nasce no leste (x negativo), sobe ao meio-dia,
 * desce a oeste (x positivo), e vai abaixo do horizonte à noite.
 *
 * Ângulo 0° = horizonte, 90° = zênite, negativo = abaixo do horizonte.
 */
function getSunPosition(time: number): [number, number, number] {
  /* Converte timeOfDay em ângulo solar: 0.0/1.0=meia-noite, 0.5=meio-dia */
  const angle = (time - 0.25) * Math.PI * 2

  /* Y = altura do sol (seno do ângulo, 0.5=zênite) */
  const y = Math.sin(angle) * 50

  /* X = posição leste-oeste (cosseno do ângulo) */
  const x = Math.cos(angle) * 50

  /* Z fixo — sol se move no plano XY com leve offset */
  const z = -20

  return [x, y, z]
}

/**
 * Retorna cor e intensidade da luz direcional baseado na hora.
 * Manhã/entardecer: dourado quente. Meio-dia: branco levemente quente.
 * Noite: azulado fraco.
 */
function getSunLight(time: number): { color: string; intensity: number } {
  /* Altura normalizada do sol (0 = horizonte, 1 = zênite) */
  const sunHeight = Math.sin((time - 0.25) * Math.PI * 2)

  /* Noite — sol abaixo do horizonte */
  if (sunHeight < -0.1) {
    return { color: '#4A5E8A', intensity: 0.1 }
  }

  /* Crepúsculo — sol próximo do horizonte */
  if (sunHeight < 0.15) {
    const t = (sunHeight + 0.1) / 0.25
    const color = lerpColor('#4A5E8A', '#FF8C42', t)
    return { color: `#${color.getHexString()}`, intensity: 0.1 + t * 0.8 }
  }

  /* Dia — interpola de dourado amanhecer/entardecer para branco meio-dia */
  const t = Math.min(1, (sunHeight - 0.15) / 0.85)
  const color = lerpColor('#FFB347', '#FFF5E0', t)
  return { color: `#${color.getHexString()}`, intensity: 0.9 + t * 0.5 }
}

/**
 * Retorna cor e intensidade da luz ambiente baseado na hora.
 * Noite: azul escuro fraco. Dia: creme quente.
 */
function getAmbientLight(time: number): { color: string; intensity: number } {
  const sunHeight = Math.sin((time - 0.25) * Math.PI * 2)

  if (sunHeight < -0.1) {
    return { color: '#1A1A3A', intensity: 0.15 }
  }

  if (sunHeight < 0.15) {
    const t = (sunHeight + 0.1) / 0.25
    const color = lerpColor('#1A1A3A', '#FAF0E0', t)
    return { color: `#${color.getHexString()}`, intensity: 0.15 + t * 0.35 }
  }

  return { color: '#FAF0E0', intensity: 0.5 }
}

/**
 * Retorna cor do fog baseada na hora.
 * Dia: azul claro. Entardecer: alaranjado. Noite: azul escuro.
 */
function getFogColor(time: number): string {
  const sunHeight = Math.sin((time - 0.25) * Math.PI * 2)

  if (sunHeight < -0.1) return '#0A0A1A'
  if (sunHeight < 0.15) {
    const t = (sunHeight + 0.1) / 0.25
    const color = lerpColor('#0A0A1A', '#D4A574', t)
    return `#${color.getHexString()}`
  }
  if (sunHeight < 0.6) {
    const t = (sunHeight - 0.15) / 0.45
    const color = lerpColor('#D4A574', '#D4E4F0', t)
    return `#${color.getHexString()}`
  }
  return '#D4E4F0'
}

export default function DynamicSky() {
  const timeOfDay = useTimeStore((s) => s.timeOfDay)

  const sunPosition = useMemo(() => getSunPosition(timeOfDay), [timeOfDay])
  const sunLight = useMemo(() => getSunLight(timeOfDay), [timeOfDay])
  const ambientLight = useMemo(() => getAmbientLight(timeOfDay), [timeOfDay])
  const fogColor = useMemo(() => getFogColor(timeOfDay), [timeOfDay])
  const sunHeight = Math.sin((timeOfDay - 0.25) * Math.PI * 2)

  /* Estrelas visíveis quando sol está baixo (noite e crepúsculo) */
  const showStars = sunHeight < 0.1

  /* Rayleigh varia com hora: mais alto no entardecer pra tons alaranjados */
  const rayleigh = sunHeight < 0.3
    ? 3 + (0.3 - sunHeight) * 5
    : 2

  return (
    <>
      {/* Fog dinâmico — cor muda com a hora do dia */}
      <fog attach="fog" args={[fogColor, 40, 150]} />

      {/* Céu atmosférico com parâmetros de golden hour */}
      <Sky
        distance={450000}
        sunPosition={sunPosition}
        turbidity={8}
        rayleigh={rayleigh}
        mieCoefficient={0.005}
        mieDirectionalG={0.7}
      />

      {/* Estrelas — aparecem gradualmente quando escurece */}
      {showStars && (
        <Stars
          radius={100}
          depth={50}
          count={3000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />
      )}

      {/* Luz ambiente dinâmica — tom e intensidade variam com a hora */}
      <ambientLight color={ambientLight.color} intensity={ambientLight.intensity} />

      {/* Luz direcional principal — sincronizada com a posição do sol */}
      <directionalLight
        color={sunLight.color}
        position={sunPosition}
        intensity={sunLight.intensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0005}
      />

      {/* Luz de preenchimento — contraluz suave, também dinâmica */}
      <directionalLight
        color={sunHeight < 0 ? '#1A2A4A' : '#B0C4DE'}
        position={[-sunPosition[0], Math.max(5, sunPosition[1] * 0.5), -sunPosition[2]]}
        intensity={sunHeight < 0 ? 0.05 : 0.3}
      />

      {/* Sprite de lens flare — disco aditivo na posição do sol */}
      {sunHeight > 0 && (
        <sprite
          position={[sunPosition[0] * 0.95, sunPosition[1] * 0.95, sunPosition[2] * 0.95]}
          scale={[sunHeight * 8 + 2, sunHeight * 8 + 2, 1]}
        >
          <spriteMaterial
            color="#FFF5E0"
            transparent
            opacity={Math.min(0.3, sunHeight * 0.4)}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      )}
    </>
  )
}
