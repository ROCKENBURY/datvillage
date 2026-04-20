import { useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

/**
 * Hook de autenticação.
 *
 * Expõe user, session, loading, playerReady e métodos de auth.
 * Na montagem, recupera sessão existente e escuta mudanças de auth.
 * Após login/signup, carrega dados do player da tabela players.
 */

/** Mensagens de erro traduzidas pra português */
function translateError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'Email ou senha incorretos.'
  if (msg.includes('User already registered')) return 'Este email já está cadastrado.'
  if (msg.includes('Email not confirmed')) return 'Confirme seu email antes de entrar.'
  if (msg.includes('Password should be at least')) return 'A senha precisa ter pelo menos 6 caracteres.'
  if (msg.includes('duplicate key') && msg.includes('name')) return 'Este nome de personagem já está em uso.'
  if (msg.includes('duplicate key') && msg.includes('players_pkey')) return 'Já existe um personagem para esta conta.'
  return msg
}

export function useAuth() {
  const { user, session, playerReady, setAuth, setPlayerReady, clear } = useAuthStore()

  /** Carrega dados do player após autenticação confirmada */
  const loadPlayer = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('players')
      .select('id')
      .eq('id', userId)
      .single()

    /* Se o player existe na tabela, está pronto pra jogar */
    setPlayerReady(!!data)
  }, [setPlayerReady])

  /* Na montagem: recupera sessão existente + escuta mudanças */
  useEffect(() => {
    /* Recupera sessão ativa do localStorage (Supabase gerencia) */
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (s?.user) {
        setAuth(s.user, s)
        loadPlayer(s.user.id)
      }
    })

    /* Escuta mudanças de auth (login, logout, token refresh) */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        if (s?.user) {
          setAuth(s.user, s)
          loadPlayer(s.user.id)
        } else {
          clear()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [setAuth, clear, loadPlayer])

  /** Login com email e senha */
  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(translateError(error.message))
  }, [])

  /**
   * Signup: cria user no Supabase Auth + perfil na tabela players.
   * Usa a função RPC create_player para atomicidade.
   */
  const signUp = useCallback(async (
    email: string,
    password: string,
    characterName: string
  ) => {
    /* 1. Cria user no Supabase Auth */
    const { data, error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) throw new Error(translateError(authError.message))
    if (!data.user) throw new Error('Erro ao criar conta. Tente novamente.')

    /* 2. Cria perfil via RPC (atômica: player + inventário inicial) */
    const { error: rpcError } = await supabase.rpc('create_player', {
      player_name: characterName,
    })

    if (rpcError) {
      /* Cleanup: remove user órfão se criação do player falhou.
         Nota: admin.deleteUser não funciona com anon key, mas o user
         ficará sem perfil — no próximo login pode tentar criar de novo. */
      throw new Error(translateError(rpcError.message))
    }

    setPlayerReady(true)
  }, [setPlayerReady])

  /** Logout — limpa sessão e estado */
  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    clear()
  }, [clear])

  return {
    user,
    session,
    loading: user !== null && !playerReady,
    isAuthenticated: !!user && playerReady,
    signIn,
    signUp,
    signOut,
  }
}
