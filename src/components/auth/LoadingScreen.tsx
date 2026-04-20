/**
 * Tela de carregamento exibida entre login e renderização do jogo.
 *
 * Aparece enquanto os dados do jogador estão sendo carregados
 * da tabela players no Supabase. Dura 1-2 segundos no máximo.
 */
export default function LoadingScreen() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0A0A0F',
        zIndex: 200,
      }}
    >
      <h1
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 48,
          fontWeight: 400,
          color: '#FAEEDA',
          letterSpacing: 4,
          margin: 0,
          textShadow: '0 0 30px rgba(250,238,218,0.15)',
        }}
      >
        DatVillage
      </h1>

      <p
        style={{
          fontFamily: 'sans-serif',
          fontSize: 15,
          color: '#666',
          marginTop: 20,
          letterSpacing: 1,
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      >
        Carregando personagem...
      </p>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
