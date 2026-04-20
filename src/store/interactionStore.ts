import { create } from 'zustand'

/**
 * Store global de interação (Zustand).
 *
 * Gerencia o estado do sistema de interação:
 * - currentTarget: nome do objeto que o jogador está mirando (ou null)
 * - dialogOpen: se há uma caixa de diálogo aberta
 * - dialogText: texto exibido na caixa de diálogo
 * - fountainActive: se a fonte está com efeito intensificado
 */

interface InteractionState {
  currentTarget: string | null
  dialogOpen: boolean
  dialogText: string
  fountainActive: boolean
  setTarget: (target: string | null) => void
  openDialog: (text: string) => void
  closeDialog: () => void
  activateFountain: () => void
}

export const useInteractionStore = create<InteractionState>((set) => ({
  currentTarget: null,
  dialogOpen: false,
  dialogText: '',
  fountainActive: false,

  setTarget: (target) => set({ currentTarget: target }),

  openDialog: (text) => set({ dialogOpen: true, dialogText: text }),

  closeDialog: () => set({ dialogOpen: false, dialogText: '' }),

  /* Ativa efeito da fonte por 3 segundos e depois desliga automaticamente */
  activateFountain: () => {
    set({ fountainActive: true })
    setTimeout(() => set({ fountainActive: false }), 3000)
  },
}))
