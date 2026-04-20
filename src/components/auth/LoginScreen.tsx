import { useState, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
import SignupModal from './SignupModal'

/**
 * Tela de login fullscreen.
 *
 * Aparece quando o jogador não tem sessão ativa.
 * Título serif grande, campos de email/senha, botão de entrar.
 * Link "Criar conta" abre modal de signup.
 */

/* Validação básica de email */
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export default function LoginScreen() {
  const { signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isValidEmail(email)) {
      setError('Email inválido.')
      return
    }
    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      await signIn(email, password)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [email, password, signIn])

  return (
    <>
      <div style={styles.container}>
        {/* Título */}
        <h1 style={styles.title}>DatVillage</h1>
        <p style={styles.subtitle}>Entre no mundo</p>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            autoComplete="current-password"
          />

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Link para signup */}
        <p style={styles.signupLink}>
          Não tem conta?{' '}
          <span
            onClick={() => setShowSignup(true)}
            style={styles.signupTrigger}
          >
            Criar conta
          </span>
        </p>
      </div>

      {/* Modal de signup */}
      {showSignup && (
        <SignupModal onClose={() => setShowSignup(false)} />
      )}
    </>
  )
}

/* Estilos inline — paleta escura com detalhes dourados */
const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0A0A0F',
    zIndex: 200,
    animation: 'fadeIn 0.5s ease-out',
  },
  title: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: 72,
    fontWeight: 400,
    color: '#FAEEDA',
    letterSpacing: 6,
    margin: 0,
    textShadow: '0 0 40px rgba(250,238,218,0.2)',
  },
  subtitle: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: 18,
    color: '#888',
    margin: '8px 0 40px',
    letterSpacing: 2,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: 320,
    maxWidth: '90vw',
  },
  input: {
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: 8,
    padding: '12px 16px',
    fontSize: 15,
    color: '#F5F0E8',
    outline: 'none',
    fontFamily: 'sans-serif',
    transition: 'border-color 0.2s',
  },
  button: {
    background: 'linear-gradient(135deg, #C9A54E, #8B7332)',
    border: 'none',
    borderRadius: 8,
    padding: '12px 0',
    fontSize: 16,
    fontWeight: 600,
    color: '#0A0A0F',
    cursor: 'pointer',
    fontFamily: 'sans-serif',
    letterSpacing: 1,
    marginTop: 4,
  },
  error: {
    color: '#E57373',
    fontSize: 13,
    margin: 0,
    textAlign: 'center' as const,
    fontFamily: 'sans-serif',
  },
  signupLink: {
    color: '#666',
    fontSize: 14,
    marginTop: 24,
    fontFamily: 'sans-serif',
  },
  signupTrigger: {
    color: '#C9A54E',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
}
