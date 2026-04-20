/**
 * Arbustos decorativos espalhados pelo vilarejo.
 * Esferas pequenas verde-escuro com flatShading — estilo low-poly.
 * Posições pré-calculadas com seed determinístico para ficar sempre igual.
 * Sem colisão: são puramente decorativos, o jogador passa por cima.
 */

/* Gerador pseudo-aleatório determinístico (mulberry32) — mesma seed = mesmas posições */
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s + 0x6D2B79F5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* Gera 22 posições de arbustos evitando o centro (fonte) e os caminhos */
function generateBushPositions() {
  const rng = seededRandom(42)
  const positions: [number, number, number][] = []

  while (positions.length < 22) {
    const x = (rng() - 0.5) * 30
    const z = (rng() - 0.5) * 30

    /* Evita o centro (fonte) e faixa dos caminhos principais */
    const distFromCenter = Math.sqrt(x * x + z * z)
    const onPathX = Math.abs(x) < 1.5
    const onPathZ = Math.abs(z) < 1.5

    if (distFromCenter > 4 && !onPathX && !onPathZ) {
      positions.push([x, 0.2, z])
    }
  }
  return positions
}

const BUSH_POSITIONS = generateBushPositions()

/* Paleta de verdes escuros quentes para os arbustos */
const BUSH_COLORS = ['#3B6D11', '#4A7A1A', '#2F5E0D', '#3F7215', '#456B20']

export default function Bushes() {
  return (
    <group>
      {BUSH_POSITIONS.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <sphereGeometry args={[0.25 + (i % 3) * 0.1, 6, 5]} />
          <meshStandardMaterial
            color={BUSH_COLORS[i % BUSH_COLORS.length]}
            flatShading
            roughness={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}
