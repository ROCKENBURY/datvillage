import { EffectComposer, Bloom, N8AO, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

/**
 * Pós-processamento profissional do vilarejo.
 *
 * Cada efeito pode ser ligado/desligado individualmente via props booleanas.
 * Ordem dos efeitos importa — são aplicados de cima pra baixo:
 *
 * 1. N8AO (Ambient Occlusion) — sombras nos cantos e contatos entre objetos
 * 2. Bloom — brilho orgânico em superfícies luminosas (janelas, fonte)
 * 3. Noise — granulação sutil tipo filme analógico
 * 4. Vignette — escurecimento dos cantos, direciona foco pro centro
 */

interface PostProcessingProps {
  /** Ativa bloom nas superfícies brilhantes (janelas, fonte) */
  bloom?: boolean
  /** Ativa ambient occlusion — sombras de contato entre objetos */
  ao?: boolean
  /** Ativa vinheta — escurecimento sutil dos cantos da tela */
  vignette?: boolean
  /** Ativa grain — granulação leve tipo película de filme */
  grain?: boolean
}

/**
 * Componente wrapper que renderiza o EffectComposer com os efeitos ativos.
 * Usa children array construída condicionalmente para evitar problemas de tipo
 * com o EffectComposer que não aceita `false | Element` como child.
 */
export default function PostProcessing({
  bloom = true,
  ao = true,
  vignette = true,
  grain = true,
}: PostProcessingProps) {
  return (
    <EffectComposer>
      {/* N8AO — alternativa performática ao SSAO tradicional.
          Usa ray marching em screen space pra calcular oclusão.
          intensity 20 pode parecer alto, mas o N8AO usa escala diferente do SSAO clássico. */}
      <N8AO
        aoRadius={ao ? 0.4 : 0}
        intensity={ao ? 20 : 0}
        aoSamples={16}
        denoiseSamples={4}
        distanceFalloff={1}
        screenSpaceRadius
      />

      {/* Bloom — brilho difuso que "vaza" de superfícies luminosas.
          mipmapBlur true usa blur multi-resolução (mais suave e performático).
          luminanceThreshold 0.8 = só superfícies bem claras brilham (janelas, highlights). */}
      <Bloom
        intensity={bloom ? 0.6 : 0}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.3}
        mipmapBlur
      />

      {/* Noise — granulação muito leve (3%) pra quebrar banding e dar textura de filme.
          BlendFunction.OVERLAY mistura preservando luminosidade original. */}
      <Noise
        premultiply
        blendFunction={BlendFunction.OVERLAY}
        opacity={grain ? 0.03 : 0}
      />

      {/* Vignette — escurece os cantos da tela progressivamente.
          offset 0.3 = começa relativamente perto do centro.
          darkness 0.5 = escurecimento moderado, não pesado. */}
      <Vignette
        offset={0.3}
        darkness={vignette ? 0.5 : 0}
      />
    </EffectComposer>
  )
}
