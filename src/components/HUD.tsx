import { useInteractionStore } from '../store/interactionStore'

/**
 * Interface visual (HUD) exibida sobre o jogo.
 *
 * Crosshair agora é círculo vazado 8px — mais sutil e profissional.
 * Tooltip de interação, caixa de diálogo e controles mantidos.
 */
export default function HUD() {
  const currentTarget = useInteractionStore((s) => s.currentTarget)
  const dialogOpen = useInteractionStore((s) => s.dialogOpen)
  const dialogText = useInteractionStore((s) => s.dialogText)

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10 }}>

      {/* Crosshair — círculo vazado, 8px, borda branca 1px, alpha 0.6 */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 8,
          height: 8,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.6)',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Tooltip de interação */}
      {currentTarget && !dialogOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: 120,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'sans-serif',
            fontSize: 14,
            color: 'white',
            background: 'rgba(0,0,0,0.6)',
            padding: '8px 16px',
            borderRadius: 8,
            whiteSpace: 'nowrap',
          }}
        >
          Pressione <b>E</b> para interagir
        </div>
      )}

      {/* Caixa de diálogo */}
      {dialogOpen && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'sans-serif',
            fontSize: 16,
            color: '#F5F0E8',
            background: '#1a1a1a',
            border: '2px solid #FFE4B5',
            padding: '24px 32px',
            borderRadius: 12,
            maxWidth: 400,
            textAlign: 'center',
            lineHeight: 1.6,
            pointerEvents: 'auto',
          }}
        >
          <div style={{ marginBottom: 16 }}>{dialogText}</div>
          <div style={{ fontSize: 12, opacity: 0.5 }}>
            Pressione <b>E</b> ou <b>Esc</b> para fechar
          </div>
        </div>
      )}

      {/* Instruções de controle */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          color: 'white',
          fontFamily: 'monospace',
          fontSize: 13,
          background: 'rgba(0,0,0,0.45)',
          padding: '10px 14px',
          borderRadius: 8,
          lineHeight: 1.6,
        }}
      >
        <div><b>Controles</b></div>
        <div>WASD — Mover</div>
        <div>Mouse — Olhar (clique para travar)</div>
        <div>Shift — Correr</div>
        <div>Space — Pular</div>
        <div>E — Interagir</div>
        <div>Esc — Liberar mouse / Fechar</div>
      </div>
    </div>
  )
}
