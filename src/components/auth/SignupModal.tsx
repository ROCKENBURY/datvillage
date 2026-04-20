import { useState, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'

/**
 * Modal de criação de conta + personagem.
 *
 * Overlay escuro com modal centralizado. Campos: email, senha,
 * confirmação de senha, nome de personagem. Validações em português.
 */

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const isValidName = (name: string) => /^[a-zA-Z0-9]{3,20}$/.test(name)

interface SignupModalProps {
  onClose: () => void
}

export default function SignupModal({ onClose }: SignupModalProps) {
  const { signUp } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [characterName, setCharacterName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    /* Validações */
    if (!isValidEmail(email)) {
      setError('Email inválido.')
      return
    }
    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    if (!isValidName(characterName)) {
      setError('Nome do personagem: 3-20 caracteres, apenas letras e números.')
      return
    }

    setLoading(true)
    try {
      await signUp(email, password, characterName)
      /* Signup bem-sucedido — modal fecha, App detecta sessão */
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [email, password, confirmPassword, characterName, signUp])

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>Criar Personagem</h2>

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
            placeholder="Senha (mínimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            autoComplete="new-password"
          />
          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            autoComplete="new-password"
          />

          {/* Separador visual */}
          <div style={styles.separator} />

          <input
            type="text"
            placeholder="Nome do personagem"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            style={styles.input}
            maxLength={20}
            autoComplete="off"
          />
          <p style={styles.hint}>
            3-20 caracteres, apenas letras e números
          </p>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Criando...' : 'Criar e Entrar'}
          </button>
        </form>

        {/* Botão fechar */}
        <p style={styles.closeLink} onClick={onClose}>
          Voltar ao login
        </p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 250,
    animation: 'fadeIn 0.3s ease-out',
  },
  modal: {
    background: '#12121A',
    border: '1px solid #2A2A35',
    borderRadius: 16,
    padding: '32px 36px',
    width: 360,
    maxWidth: '90vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: 28,
    fontWeight: 400,
    color: '#FAEEDA',
    margin: '0 0 24px',
    letterSpacing: 2,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: '100%',
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
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  separator: {
    height: 1,
    background: '#2A2A35',
    margin: '4px 0',
  },
  hint: {
    color: '#555',
    fontSize: 12,
    margin: '-4px 0 0',
    fontFamily: 'sans-serif',
  },
  error: {
    color: '#E57373',
    fontSize: 13,
    margin: 0,
    textAlign: 'center' as const,
    fontFamily: 'sans-serif',
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
  closeLink: {
    color: '#555',
    fontSize: 13,
    marginTop: 16,
    cursor: 'pointer',
    fontFamily: 'sans-serif',
  },
}
