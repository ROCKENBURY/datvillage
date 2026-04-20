import { useTimeStore } from '../store/timeStore'

/**
 * Slider temporário para testar o ciclo dia/noite.
 *
 * Controla timeOfDay (0–1) em tempo real. Posicionado no canto
 * superior direito como overlay HTML. Mostra o valor atual e
 * um label descritivo da fase do dia.
 */

/** Retorna nome legível da fase do dia baseado no valor */
function getPhaseLabel(time: number): string {
  if (time < 0.05) return 'Meia-noite'
  if (time < 0.15) return 'Madrugada'
  if (time < 0.25) return 'Amanhecer'
  if (time < 0.4) return 'Manhã'
  if (time < 0.6) return 'Meio-dia'
  if (time < 0.72) return 'Tarde'
  if (time < 0.82) return 'Golden Hour'
  if (time < 0.9) return 'Crepúsculo'
  if (time < 0.95) return 'Anoitecer'
  return 'Noite'
}

export default function TimeSlider() {
  const timeOfDay = useTimeStore((s) => s.timeOfDay)
  const setTimeOfDay = useTimeStore((s) => s.setTimeOfDay)

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 20,
        fontFamily: 'sans-serif',
        fontSize: 13,
        color: 'white',
        background: 'rgba(0,0,0,0.5)',
        padding: '10px 16px',
        borderRadius: 8,
        minWidth: 160,
        pointerEvents: 'auto',
      }}
    >
      <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
        <span>Hora do dia</span>
        <span style={{ opacity: 0.6 }}>{getPhaseLabel(timeOfDay)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.005}
        value={timeOfDay}
        onChange={(e) => setTimeOfDay(parseFloat(e.target.value))}
        style={{ width: '100%', cursor: 'pointer' }}
      />
    </div>
  )
}
