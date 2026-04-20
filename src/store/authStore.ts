import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'

/**
 * Store global de autenticação (Zustand).
 *
 * Guarda o user e session do Supabase Auth.
 * playerReady indica se os dados do jogador (tabela players)
 * já foram carregados — controla a tela de loading.
 */

interface AuthState {
  user: User | null
  session: Session | null
  playerReady: boolean
  setAuth: (user: User | null, session: Session | null) => void
  setPlayerReady: (ready: boolean) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  playerReady: false,

  setAuth: (user, session) => set({ user, session }),
  setPlayerReady: (ready) => set({ playerReady: ready }),
  clear: () => set({ user: null, session: null, playerReady: false }),
}))
