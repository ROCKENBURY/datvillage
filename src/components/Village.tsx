import House from './House'
import Tree from './Tree'
import Fountain from './Fountain'
import VillagePaths from './Path'
import Ground from './Ground'
import Bushes from './Bushes'
import Sign from './Sign'

/**
 * Vilarejo completo — versão com interações.
 *
 * Inclui 3 placas de madeira posicionadas em pontos estratégicos:
 * - Entrada sul: boas-vindas
 * - Perto da fonte: história da fonte
 * - Saída norte: convite para explorar
 *
 * Para adicionar mais casas/árvores: duplique e mude position/cores.
 */

const deg = (d: number) => (d * Math.PI) / 180

export default function Village() {
  return (
    <group>
      {/* Chão em tiles com variação de verde */}
      <Ground />

      {/* Caminhos de terra conectando os pontos do vilarejo */}
      <VillagePaths />

      {/* Arbustos decorativos */}
      <Bushes />

      {/* === FONTE CENTRAL interativa === */}
      <Fountain position={[0, 0, 0]} />

      {/* === PLACAS DE MADEIRA === */}

      {/* Placa 1 — Entrada sul, virada pro jogador que chega */}
      <Sign
        position={[1.5, 0, 8]}
        text="Bem-vindo ao vilarejo!"
        rotationY={deg(0)}
      />

      {/* Placa 2 — Ao lado da fonte, informação histórica */}
      <Sign
        position={[2.5, 0, -1.5]}
        text="A fonte foi construída em 1847."
        rotationY={deg(-30)}
      />

      {/* Placa 3 — Caminho norte, convite pra explorar */}
      <Sign
        position={[-1.5, 0, -7]}
        text="Continue explorando..."
        rotationY={deg(15)}
      />

      {/* === CASAS com portas interativas === */}

      <House
        position={[-6, 0, -6]}
        roofColor="#C75B39"
        wallColor="#FFF0DB"
        scaleY={1.2}
        rotationY={deg(12)}
      />

      <House
        position={[6, 0, -6]}
        roofColor="#5C6BC0"
        wallColor="#FBF0E8"
        scaleY={1.0}
        rotationY={deg(-8)}
      />

      <House
        position={[-7, 0, 5]}
        roofColor="#6B8E23"
        wallColor="#FFF3E0"
        scaleY={0.9}
        rotationY={deg(15)}
      />

      <House
        position={[7, 0, 6]}
        roofColor="#8E4585"
        wallColor="#FFF0F5"
        scale={1.2}
        scaleY={1.35}
        rotationY={deg(-5)}
      />

      <House
        position={[0, 0, -10]}
        roofColor="#D4763A"
        wallColor="#FFF8E7"
        scaleY={1.1}
        rotationY={deg(6)}
      />

      {/* === ÁRVORES === */}

      <Tree position={[-10, 0, -3]} scale={1.0} crownColor="#5B8C3E" rotationY={deg(45)} />
      <Tree position={[-10, 0, 3]} scale={1.2} crownColor="#4A7C3F" rotationY={deg(120)} />
      <Tree position={[-10, 0, 8]} scale={0.9} crownColor="#3D6B2E" rotationY={deg(200)} />

      <Tree position={[10, 0, -2]} scale={0.85} crownColor="#6B9E4A" rotationY={deg(70)} />
      <Tree position={[10, 0, 4]} scale={1.1} crownColor="#4E8235" rotationY={deg(160)} />
      <Tree position={[11, 0, 9]} scale={1.25} crownColor="#3A6928" rotationY={deg(300)} />

      <Tree position={[-3, 0, -9]} scale={0.75} crownColor="#5F9142" rotationY={deg(30)} />
      <Tree position={[4, 0, -9]} scale={1.0} crownColor="#4D7F36" rotationY={deg(90)} />
      <Tree position={[3, 0, 10]} scale={1.1} crownColor="#5B8C3E" rotationY={deg(250)} />
      <Tree position={[-5, 0, 10]} scale={1.3} crownColor="#3D6B2E" rotationY={deg(180)} />

      <Tree position={[-8, 0, -14]} scale={1.1} crownColor="#3A6928" rotationY={deg(55)} />
      <Tree position={[-4, 0, -15]} scale={1.3} crownColor="#2D5A1F" rotationY={deg(140)} />
      <Tree position={[2, 0, -14]} scale={0.9} crownColor="#4A7C3F" rotationY={deg(210)} />
      <Tree position={[6, 0, -15]} scale={1.2} crownColor="#376325" rotationY={deg(330)} />
      <Tree position={[10, 0, -13]} scale={1.0} crownColor="#3D6B2E" rotationY={deg(80)} />
    </group>
  )
}
