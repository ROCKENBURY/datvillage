/**
 * Flores decorativas espalhadas pelo gramado.
 *
 * ~35 tufos de cor (esferas achatadas) em 3 cores: amarelo, rosa e branco.
 * Posições pré-calculadas com seed determinístico, evitando caminhos,
 * a fonte central e o interior das casas.
 */

/* Gerador pseudo-aleatório determinístico */
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s + 0x6D2B79F5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* Paleta de flores — tons quentes que combinam com golden hour */
const FLOWER_COLORS = ['#FAC775', '#F4C0D1', '#F5F0E0', '#E8A87C', '#D4A5C8']

/* Gera posições evitando caminhos (faixa central X/Z < 1.5) e fonte (raio < 3) */
function generateFlowerPositions() {
  const rng = seededRandom(77)
  const flowers: { pos: [number, number, number]; color: string; scale: number }[] = []

  while (flowers.length < 35) {
    const x = (rng() - 0.5) * 28
    const z = (rng() - 0.5) * 28

    const distFromCenter = Math.sqrt(x * x + z * z)
    const onPathX = Math.abs(x) < 1.5
    const onPathZ = Math.abs(z) < 1.5

    /* Evita centro (fonte), caminhos e áreas próximas das casas */
    if (distFromCenter > 3.5 && !onPathX && !onPathZ) {
      flowers.push({
        pos: [x, 0.05, z],
        color: FLOWER_COLORS[Math.floor(rng() * FLOWER_COLORS.length)],
        scale: 0.06 + rng() * 0.08,
      })
    }
  }
  return flowers
}

const FLOWERS = generateFlowerPositions()

export default function Flowers() {
  return (
    <group>
      {FLOWERS.map((f, i) => (
        <mesh key={i} position={f.pos} scale={[f.scale, f.scale * 0.5, f.scale]}>
          <sphereGeometry args={[1, 6, 4]} />
          <meshStandardMaterial color={f.color} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}
