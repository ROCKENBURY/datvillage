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
import LoginScreen from './components/auth/LoginScreen'
import LoadingScreen from './components/auth/LoadingScreen'
import { useAuth } from './hooks/useAuth'

/**
 * Componente raiz da aplicação.
 *
 * Fluxo de auth:
 * 1. Sem sessão → LoginScreen (fullscreen, sem Canvas)
 * 2. Sessão ativa mas player carregando → LoadingScreen
 * 3. Tudo pronto → Canvas 3D com o jogo
 *
 * Nota: SplashScreen removida — LoginScreen agora é a primeira tela.
 */
export default function App() {
  const { user, isAuthenticated, loading } = useAuth()

  /* Sem sessão → tela de login */
  if (!user) {
    return <LoginScreen />
  }

  /* Sessão ativa, mas dados do player ainda carregando */
  if (loading || !isAuthenticated) {
    return <LoadingScreen />
  }

  /* Tudo pronto → renderiza o jogo */
  return (
    <>
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
