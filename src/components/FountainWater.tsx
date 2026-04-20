import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import { useInteractionStore } from '../store/interactionStore'

/**
 * Água da fonte com shader customizado.
 *
 * Usa um ShaderMaterial que combina:
 * - Normal map procedural gerado via Canvas (padrão de ruído pra ondulação)
 * - Duas camadas de UV scrolling em direções opostas (simula corrente)
 * - Reflexão do céu via envMap simplificado (cor do céu interpolada)
 * - Specular highlight na direção do sol
 * - Transparência com fresnel (mais opaco nas bordas, mais claro no centro)
 *
 * A intensidade da ondulação aumenta quando o jogador ativa a fonte (pressiona E).
 */

/**
 * Gera um normal map procedural via Canvas 2D.
 * Cria padrão de ruído que, quando usado como normal map com UV scroll,
 * simula ondulação convincente na superfície da água.
 */
function generateWaterNormalMap(size = 256): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  /* Preenche com azul neutro (normal apontando pra cima: 128,128,255) */
  ctx.fillStyle = 'rgb(128,128,255)'
  ctx.fillRect(0, 0, size, size)

  /* Adiciona perturbações — múltiplas ondas senoidais sobrepostas */
  const imageData = ctx.getImageData(0, 0, size, size)
  const data = imageData.data

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4

      /* Soma de ondas senoidais em diferentes frequências (octaves) */
      const wave1 = Math.sin(x * 0.05) * Math.cos(y * 0.05) * 30
      const wave2 = Math.sin(x * 0.1 + y * 0.08) * 15
      const wave3 = Math.sin(x * 0.2 - y * 0.15) * 8
      const wave4 = Math.sin(x * 0.03 + y * 0.04) * 20

      /* R e G são as componentes X e Y da normal */
      data[i] = 128 + wave1 + wave3       // R — perturbação X
      data[i + 1] = 128 + wave2 + wave4   // G — perturbação Y
      /* B fica perto de 255 (normal aponta majoritariamente pra cima) */
      data[i + 2] = 240
      data[i + 3] = 255
    }
  }

  ctx.putImageData(imageData, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearMipmapLinearFilter

  return texture
}

/* Vertex shader — passa UVs e posição pro fragment, com ondulação via seno */
const waterVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormal;

  void main() {
    vUv = uv;

    /* Ondulação no vértice — desloca Y com ondas senoidais */
    vec3 pos = position;
    float wave = sin(pos.x * 3.0 + uTime * 2.0 * uIntensity) * 0.02 * uIntensity
               + cos(pos.z * 2.5 + uTime * 1.5 * uIntensity) * 0.015 * uIntensity
               + sin((pos.x + pos.z) * 4.0 + uTime * 3.0) * 0.008 * uIntensity;
    pos.y += wave;

    vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

/* Fragment shader — combina normal map scrollado, reflexão, specular e fresnel */
const waterFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform sampler2D uNormalMap;
  uniform vec3 uWaterColor;
  uniform vec3 uSunDirection;
  uniform vec3 uSunColor;
  uniform vec3 uSkyColor;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormal;

  void main() {
    /* Duas camadas de UV scrolling em direções opostas — simula corrente */
    float speed = uTime * 0.08 * uIntensity;
    vec2 uv1 = vUv * 3.0 + vec2(speed, speed * 0.7);
    vec2 uv2 = vUv * 2.5 - vec2(speed * 0.6, speed * 0.9);

    /* Amostra normal map nas duas camadas e combina */
    vec3 n1 = texture2D(uNormalMap, uv1).rgb * 2.0 - 1.0;
    vec3 n2 = texture2D(uNormalMap, uv2).rgb * 2.0 - 1.0;
    vec3 normal = normalize(n1 + n2);

    /* View direction pra cálculos de reflexão e fresnel */
    vec3 viewDir = normalize(cameraPosition - vWorldPos);

    /* Fresnel — bordas mais opacas, centro mais transparente */
    float fresnel = pow(1.0 - max(dot(viewDir, vec3(normal.x * 0.3, 1.0, normal.y * 0.3)), 0.0), 3.0);
    fresnel = 0.3 + 0.7 * fresnel;

    /* Reflexão simplificada do céu — lerp entre cor da água e cor do céu */
    vec3 reflectDir = reflect(-viewDir, vec3(normal.x * 0.2, 1.0, normal.y * 0.2));
    float skyMix = max(reflectDir.y, 0.0);
    vec3 reflection = mix(uWaterColor, uSkyColor, skyMix * 0.6);

    /* Specular highlight — brilho do sol na superfície */
    vec3 sunDir = normalize(uSunDirection);
    vec3 halfDir = normalize(viewDir + sunDir);
    float spec = pow(max(dot(vec3(normal.x * 0.3, 1.0, normal.y * 0.3), halfDir), 0.0), 128.0);
    vec3 specular = uSunColor * spec * 1.5;

    /* Composição final — água + reflexão + specular com transparência fresnel */
    vec3 color = mix(uWaterColor, reflection, 0.5) + specular;

    gl_FragColor = vec4(color, fresnel * 0.8);
  }
`

/* Cria material customizado via drei shaderMaterial helper */
const WaterShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uIntensity: 1,
    uNormalMap: new THREE.Texture(),
    uWaterColor: new THREE.Color('#557799'),
    uSunDirection: new THREE.Vector3(1, 1, 0),
    uSunColor: new THREE.Color('#FFE4B5'),
    uSkyColor: new THREE.Color('#D4E4F0'),
  },
  waterVertexShader,
  waterFragmentShader
)

/* Registra o material como elemento JSX */
extend({ WaterShaderMaterial })

/* Declaração de tipo pro TypeScript reconhecer o elemento JSX */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      waterShaderMaterial: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, unknown>
    }
  }
}

interface FountainWaterProps {
  /** Posição Y da superfície da água */
  yPosition?: number
  /** Raio do disco de água */
  radius?: number
}

export default function FountainWater({
  yPosition = 0.55,
  radius = 1.0,
}: FountainWaterProps) {
  const matRef = useRef<THREE.ShaderMaterial & {
    uTime: number
    uIntensity: number
    uSunDirection: THREE.Vector3
    uSunColor: THREE.Color
    uSkyColor: THREE.Color
  }>(null)
  const splashRef = useRef<THREE.Mesh>(null)

  const { scene } = useThree()

  /* Gera normal map procedural uma vez e reutiliza */
  const normalMap = useMemo(() => generateWaterNormalMap(256), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const isActive = useInteractionStore.getState().fountainActive
    const intensity = isActive ? 2.5 : 1

    /* Atualiza uniforms do shader */
    if (matRef.current) {
      matRef.current.uTime = t
      matRef.current.uIntensity = THREE.MathUtils.lerp(
        matRef.current.uIntensity,
        intensity,
        0.05
      )

      /* Sincroniza direção do sol com a directional light principal da cena */
      scene.traverse((obj) => {
        if (obj instanceof THREE.DirectionalLight && obj.castShadow) {
          matRef.current!.uSunDirection.copy(obj.position).normalize()
          matRef.current!.uSunColor.copy(obj.color)
        }
      })
    }

    /* Splash central — anel que pulsa no centro da fonte */
    if (splashRef.current) {
      const pulseScale = 1 + Math.sin(t * 3 * intensity) * 0.15 * intensity
      splashRef.current.scale.set(pulseScale, pulseScale, 1)
      const mat = splashRef.current.material as THREE.MeshStandardMaterial
      mat.opacity = isActive
        ? 0.4 + Math.sin(t * 5) * 0.15
        : 0.15 + Math.sin(t * 2) * 0.05
    }
  })

  return (
    <group>
      {/* Superfície de água com shader customizado */}
      <mesh position={[0, yPosition, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 32]} />
        {/* @ts-expect-error — material customizado registrado via extend */}
        <waterShaderMaterial
          ref={matRef}
          uNormalMap={normalMap}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Ripple/splash central — anel que simula ponto de impacto da água caindo */}
      <mesh
        ref={splashRef}
        position={[0, yPosition + 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.08, 0.2, 16]} />
        <meshStandardMaterial
          color="#B0E0FF"
          emissive="#B0E0FF"
          emissiveIntensity={0.2}
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>

      {/* Segundo anel de ripple — mais largo, defasado */}
      <mesh
        position={[0, yPosition + 0.005, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.3, 0.42, 16]} />
        <meshStandardMaterial
          color="#88C8E8"
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
