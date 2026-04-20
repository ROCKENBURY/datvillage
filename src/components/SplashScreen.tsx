import { useState, useCallback } from 'react'

/**
 * Splash screen profissional exibida antes da cena.
 *
 * Fundo escuro com gradient sutil, título "DatVillage" em fonte serif
 * elegante, subtítulo "Clique para entrar". Ao clicar, fade out suave
 * de 0.8s e libera a cena por trás (que já está rodando).
 */

export default function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  const handleClick = useCallback(() => {
    if (fading) return
    setFading(true)
    /* Espera a animação de fade completar antes de remover do DOM */
    setTimeout(() => setVisible(false), 800)
  }, [fading])

  if (!visible) return null

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        /* Gradient radial sutil — centro um pouco mais claro */
        background: 'radial-gradient(ellipse at center, #1a1c2e 0%, #0d0e18 70%, #060610 100%)',
        /* Fade out suave */
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.8s ease-out',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      {/* Título principal — fonte serif elegante */}
      <h1
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 64,
          fontWeight: 400,
          color: '#FFE4B5',
          letterSpacing: 6,
          margin: 0,
          textShadow: '0 0 40px rgba(255,228,181,0.3)',
        }}
      >
        DatVillage
      </h1>

      {/* Linha decorativa */}
      <div
        style={{
          width: 80,
          height: 1,
          background: 'linear-gradient(90deg, transparent, #FFE4B5, transparent)',
          margin: '20px 0',
        }}
      />

      {/* Subtítulo */}
      <p
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 16,
          color: 'rgba(255,228,181,0.6)',
          letterSpacing: 3,
          margin: 0,
          animation: 'pulse 2s ease-in-out infinite',
        }}
      >
        Clique para entrar
      </p>

      {/* Animação de pulse via CSS inline */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
