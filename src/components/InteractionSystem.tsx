import { useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useInteractionStore } from '../store/interactionStore'

/**
 * Sistema de interação via raycaster.
 *
 * A cada frame, dispara um raio do centro da câmera e verifica se atinge
 * alguma mesh marcada com userData.interactive = true a até 3 unidades.
 * Atualiza o store com o nome do alvo atual.
 *
 * Também escuta a tecla E para disparar a ação do objeto mirando.
 * Escuta Esc para fechar diálogos abertos.
 */

/* Distância máxima de interação em unidades do mundo */
const INTERACT_DISTANCE = 3

export default function InteractionSystem() {
  const { camera, scene } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const center = useRef(new THREE.Vector2(0, 0))

  const setTarget = useInteractionStore((s) => s.setTarget)
  const closeDialog = useInteractionStore((s) => s.closeDialog)

  /* Ref para o target atual — permite ler no handler de teclado sem re-render */
  const targetRef = useRef<string | null>(null)
  const actionRef = useRef<(() => void) | null>(null)

  /* Handler da tecla E — dispara ação do objeto ou fecha diálogo */
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        /* Se diálogo está aberto, E fecha ele */
        if (useInteractionStore.getState().dialogOpen) {
          closeDialog()
          return
        }
        /* Se há alvo e ação, executa */
        if (targetRef.current && actionRef.current) {
          actionRef.current()
        }
      }
      /* Esc também fecha diálogo */
      if (e.code === 'Escape' && useInteractionStore.getState().dialogOpen) {
        closeDialog()
      }
    },
    [closeDialog]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  /**
   * A cada frame: lança raio do centro da tela, percorre intersecções
   * subindo pela hierarquia de parents até encontrar um objeto interativo.
   */
  useFrame(() => {
    /* Não faz raycast se diálogo está aberto */
    if (useInteractionStore.getState().dialogOpen) return

    raycaster.current.setFromCamera(center.current, camera)
    raycaster.current.far = INTERACT_DISTANCE

    const intersects = raycaster.current.intersectObjects(scene.children, true)

    let found = false
    for (const hit of intersects) {
      /* Sobe pela hierarquia procurando userData.interactive */
      let obj: THREE.Object3D | null = hit.object
      while (obj) {
        if (obj.userData.interactive) {
          targetRef.current = obj.userData.interactiveName || 'objeto'
          actionRef.current = obj.userData.onInteract || null
          setTarget(targetRef.current)
          found = true
          break
        }
        obj = obj.parent
      }
      if (found) break
    }

    if (!found) {
      targetRef.current = null
      actionRef.current = null
      setTarget(null)
    }
  })

  /* Componente invisível — só lógica, sem render */
  return null
}
