import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import * as THREE from 'three'
import Village from './components/Village'
import Player from './components/Player'
import HUD from './components/HUD'
import InteractionSystem from './components/InteractionSystem'

/**
 * Componente raiz da aplicação.
 *
 * Inclui o InteractionSystem dentro do Canvas — gerencia raycaster
 * e detecção de objetos interativos a cada frame.
 */
export default function App() {
  return (
    <>
      <HUD />

      <Canvas
        shadows
        camera={{ fov: 70, near: 0.1, far: 200 }}
        style={{ width: '100vw', height: '100vh' }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
      >
        <fog attach="fog" args={['#D4E4F0', 40, 150]} />

        <Sky
          sunPosition={[30, 8, -40]}
          turbidity={8}
          rayleigh={2}
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />

        <ambientLight color="#FAF0E0" intensity={0.5} />

        <directionalLight
          color="#FFE4B5"
          position={[15, 20, 10]}
          intensity={1.4}
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

        <directionalLight
          color="#B0C4DE"
          position={[-10, 10, -15]}
          intensity={0.3}
        />

        {/* Sistema de interação — raycaster + detecção de alvo */}
        <InteractionSystem />

        <Physics gravity={[0, -9.81, 0]}>
          <Village />
          <Player />
        </Physics>
      </Canvas>
    </>
  )
}
