import { useInteractionStore } from '../store/interactionStore'

/**
 * Interface visual (HUD) exibida sobre o jogo.
 *
 * Contém:
 * - Crosshair central: ponto de 4px com borda escura
 * - Tooltip de interação: aparece quando mirando objeto interativo
 * - Caixa de diálogo: exibida ao interagir com placas
 * - Instruções de controle no canto inferior esquerdo
 */
export default function HUD() {
  const currentTarget = useInteractionStore((s) => s.currentTarget)
  const dialogOpen = useInteractionStore((s) => s.dialogOpen)
  const dialogText = useInteractionStore((s) => s.dialogText)

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10 }}>

      {/* Crosshair — ponto central de 4px com borda escura para contraste */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: 'white',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 2px rgba(0,0,0,0.8)',
        }}
      />

      {/* Tooltip de interação — aparece quando mirando algo interativo */}
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

      {/* Caixa de diálogo — exibida ao interagir com placas */}
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

      {/* Instruções de controle — canto inferior esquerdo */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          color: 'white',
          fontFamily: 'monospace',
          fontSize: 14,
          background: 'rgba(0,0,0,0.5)',
          padding: '12px 16px',
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
