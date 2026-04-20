import { useRef, useEffect, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'

/**
 * Jogador em primeira pessoa.
 *
 * Controles:
 *   WASD  — movimentação
 *   Mouse — olhar ao redor (após clicar na tela para travar o ponteiro)
 *   Shift — correr (dobra a velocidade)
 *   Space — pular
 *
 * Usa um RigidBody cápsula do Rapier para colisão física.
 * O pointer lock é ativado ao clicar no canvas — libera com Esc.
 */

/* Velocidades de movimento */
const WALK_SPEED = 5
const RUN_SPEED = 10
const JUMP_FORCE = 5

export default function Player() {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const { camera, gl } = useThree()

  /* Estado das teclas pressionadas */
  const keys = useRef<Record<string, boolean>>({})

  /* Rotação da câmera (yaw e pitch) controlada pelo mouse */
  const yaw = useRef(0)
  const pitch = useRef(0)

  /* Flag para saber se o jogador está no chão (pode pular) */
  const [canJump, setCanJump] = useState(true)

  /* Ativa o pointer lock ao clicar no canvas */
  const handleClick = useCallback(() => {
    gl.domElement.requestPointerLock()
  }, [gl])

  useEffect(() => {
    const canvas = gl.domElement

    /* Listener de teclado — registra teclas pressionadas e soltas */
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true
    }
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false
    }

    /* Listener de mouse — atualiza yaw/pitch quando pointer está travado */
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return
      yaw.current -= e.movementX * 0.002
      pitch.current -= e.movementY * 0.002
      /* Limita o pitch para não virar de cabeça pra baixo */
      pitch.current = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, pitch.current))
    }

    canvas.addEventListener('click', handleClick)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      canvas.removeEventListener('click', handleClick)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [gl, handleClick])

  /**
   * Loop de update por frame:
   * 1. Lê as teclas pressionadas e calcula direção de movimento
   * 2. Aplica velocidade ao RigidBody (preservando velocidade Y para gravidade)
   * 3. Atualiza a câmera para seguir a posição do corpo físico
   */
  useFrame(() => {
    const rb = rigidBodyRef.current
    if (!rb) return

    const k = keys.current
    const isRunning = k['ShiftLeft'] || k['ShiftRight']
    const speed = isRunning ? RUN_SPEED : WALK_SPEED

    /* Vetor de direção baseado nas teclas WASD */
    const direction = new THREE.Vector3()
    if (k['KeyW']) direction.z -= 1
    if (k['KeyS']) direction.z += 1
    if (k['KeyA']) direction.x -= 1
    if (k['KeyD']) direction.x += 1
    direction.normalize()

    /* Rotaciona a direção pelo yaw da câmera (ignora pitch para andar reto) */
    const euler = new THREE.Euler(0, yaw.current, 0, 'YXZ')
    direction.applyEuler(euler)

    /* Pega velocidade atual para preservar componente Y (gravidade/pulo) */
    const currentVel = rb.linvel()

    rb.setLinvel(
      { x: direction.x * speed, y: currentVel.y, z: direction.z * speed },
      true
    )

    /* Pulo — só se estiver no chão (Y próximo de zero ou muito baixa) */
    if (k['Space'] && canJump) {
      rb.setLinvel({ x: currentVel.x, y: JUMP_FORCE, z: currentVel.z }, true)
      setCanJump(false)
      /* Reabilita pulo após breve delay (simplificação de "ground check") */
      setTimeout(() => setCanJump(true), 500)
    }

    /* Atualiza a câmera para acompanhar o corpo do jogador */
    const pos = rb.translation()
    camera.position.set(pos.x, pos.y + 0.5, pos.z)
    camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ')
  })

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      position={[0, 2, 10]}
      enabledRotations={[false, false, false]}
      mass={1}
      linearDamping={0.5}
    >
      {/* Collider cápsula — formato humanoide para o jogador */}
      <CapsuleCollider args={[0.5, 0.5]} />
    </RigidBody>
  )
}
