import { create } from 'zustand'

/**
 * Store global de hora do dia (Zustand).
 *
 * timeOfDay vai de 0.0 a 1.0 representando o ciclo completo:
 *   0.00 = meia-noite
 *   0.05 = nascer do sol
 *   0.25 = manhã
 *   0.50 = meio-dia
 *   0.72 = golden hour (fim de tarde) ← valor inicial
 *   0.85 = crepúsculo
 *   0.95 = noite
 *   1.00 = meia-noite novamente
 */

interface TimeState {
  timeOfDay: number
  setTimeOfDay: (time: number) => void
}

export const useTimeStore = create<TimeState>((set) => ({
  /* Inicializa em golden hour — 72% do ciclo do dia */
  timeOfDay: 0.72,
  setTimeOfDay: (time) => set({ timeOfDay: Math.max(0, Math.min(1, time)) }),
}))
