import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import * as THREE from 'three'
import Village from './components/Village'
import Player from './components/Player'
import HUD from './components/HUD'
import InteractionSystem from './components/InteractionSystem'
import PostProcessing from './components/PostProcessing'
import DynamicSky from './components/DynamicSky'
import TimeSlider from './components/TimeSlider'

/**
 * Componente raiz da aplicação.
 *
 * O DynamicSky agora gerencia céu, fog, luzes e estrelas — tudo reativo
 * ao timeOfDay controlado pelo slider. Substitui as luzes e Sky estáticos.
 */
export default function App() {
  return (
    <>
      <HUD />
      <TimeSlider />

      <Canvas
        shadows
        camera={{ fov: 70, near: 0.1, far: 200 }}
        style={{ width: '100vw', height: '100vh' }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
      >
        {/* Céu dinâmico — controla sol, luzes, fog, estrelas e lens flare */}
        <DynamicSky />

        {/* Pós-processamento — bloom, AO, vinheta, grain */}
        <PostProcessing />

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
