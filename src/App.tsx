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
import AmbientSound from './components/AmbientSound'
import SplashScreen from './components/SplashScreen'

/**
 * Componente raiz da aplicação.
 *
 * Splash screen cobre a cena até o clique inicial.
 * Canvas usa PCFSoftShadowMap para sombras com borda suave.
 * FOV ajustado para 65 — mais imersivo que o padrão.
 */
export default function App() {
  return (
    <>
      {/* Splash screen — cobre tudo até o clique, depois faz fade out */}
      <SplashScreen />

      <HUD />
      <TimeSlider />
      <AmbientSound />

      <Canvas
        shadows={{ type: THREE.PCFSoftShadowMap }}
        camera={{ fov: 65, near: 0.1, far: 200 }}
        style={{ width: '100vw', height: '100vh' }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
      >
        <DynamicSky />
        <PostProcessing />
        <InteractionSystem />

        <Physics gravity={[0, -9.81, 0]}>
          <Village />
          <Player />
        </Physics>
      </Canvas>
    </>
  )
}
