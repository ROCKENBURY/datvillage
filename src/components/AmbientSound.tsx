import { useEffect, useRef } from 'react'

/**
 * Som ambiente procedural do vilarejo.
 *
 * Gera 3 camadas de som via Web Audio API (sem arquivos externos):
 * 1. Vento: ruído rosa filtrado com lowpass 400Hz, modulado lentamente
 * 2. Pássaros: oscilador sine 2000-4000Hz com envelope rápido, aleatório
 * 3. Ambiência: ruído branco com highpass 100Hz, volume muito baixo
 *
 * Volume geral 0.15 — não compete com som da fonte.
 * Inicia na primeira interação do usuário (clique) por exigência dos browsers.
 */

export default function AmbientSound() {
  const ctxRef = useRef<AudioContext | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    /** Inicializa o sistema de áudio na primeira interação do usuário */
    function startAudio() {
      if (startedRef.current) return
      startedRef.current = true

      const ctx = new AudioContext()
      ctxRef.current = ctx

      /* Master volume — controla tudo */
      const masterGain = ctx.createGain()
      masterGain.gain.value = 0.15
      masterGain.connect(ctx.destination)

      /* === VENTO: ruído rosa + lowpass === */
      const windBufferSize = ctx.sampleRate * 10
      const windBuffer = ctx.createBuffer(1, windBufferSize, ctx.sampleRate)
      const windData = windBuffer.getChannelData(0)

      /* Gera ruído rosa (aproximação via filtro de 1ª ordem sobre ruído branco) */
      let b0 = 0, b1 = 0, b2 = 0
      for (let i = 0; i < windBufferSize; i++) {
        const white = Math.random() * 2 - 1
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.96900 * b2 + white * 0.1538520
        windData[i] = (b0 + b1 + b2 + white * 0.5362) * 0.11
      }

      const windSource = ctx.createBufferSource()
      windSource.buffer = windBuffer
      windSource.loop = true

      const windFilter = ctx.createBiquadFilter()
      windFilter.type = 'lowpass'
      windFilter.frequency.value = 400

      /* LFO pra modular o volume do vento lentamente */
      const windGain = ctx.createGain()
      windGain.gain.value = 0.6

      const windLfo = ctx.createOscillator()
      windLfo.frequency.value = 0.1
      const windLfoGain = ctx.createGain()
      windLfoGain.gain.value = 0.2
      windLfo.connect(windLfoGain).connect(windGain.gain)
      windLfo.start()

      windSource.connect(windFilter).connect(windGain).connect(masterGain)
      windSource.start()

      /* === AMBIÊNCIA: ruído branco + highpass, volume baixíssimo === */
      const ambBufferSize = ctx.sampleRate * 8
      const ambBuffer = ctx.createBuffer(1, ambBufferSize, ctx.sampleRate)
      const ambData = ambBuffer.getChannelData(0)
      for (let i = 0; i < ambBufferSize; i++) {
        ambData[i] = Math.random() * 2 - 1
      }

      const ambSource = ctx.createBufferSource()
      ambSource.buffer = ambBuffer
      ambSource.loop = true

      const ambFilter = ctx.createBiquadFilter()
      ambFilter.type = 'highpass'
      ambFilter.frequency.value = 100

      const ambGain = ctx.createGain()
      ambGain.gain.value = 0.15

      ambSource.connect(ambFilter).connect(ambGain).connect(masterGain)
      ambSource.start()

      /* === PÁSSAROS: chirps aleatórios a cada 3-8 segundos === */
      function scheduleChirp() {
        /* Delay aleatório entre 3 e 8 segundos */
        const delay = 3 + Math.random() * 5

        setTimeout(() => {
          if (!ctxRef.current || ctxRef.current.state === 'closed') return

          /* Oscilador com frequência aleatória entre 2000-4000Hz */
          const osc = ctx.createOscillator()
          osc.type = 'sine'
          const baseFreq = 2000 + Math.random() * 2000
          osc.frequency.setValueAtTime(baseFreq, ctx.currentTime)
          /* Glide descendente rápido — simula canto de pássaro */
          osc.frequency.exponentialRampToValueAtTime(
            baseFreq * 0.7,
            ctx.currentTime + 0.15
          )

          /* Envelope curto — ataque rápido, decay rápido */
          const chirpGain = ctx.createGain()
          chirpGain.gain.setValueAtTime(0, ctx.currentTime)
          chirpGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02)
          chirpGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)

          osc.connect(chirpGain).connect(masterGain)
          osc.start(ctx.currentTime)
          osc.stop(ctx.currentTime + 0.25)

          /* Segundo chirp rápido (resposta) — 60% de chance */
          if (Math.random() > 0.4) {
            const osc2 = ctx.createOscillator()
            osc2.type = 'sine'
            const freq2 = baseFreq * 1.2 + Math.random() * 500
            osc2.frequency.setValueAtTime(freq2, ctx.currentTime + 0.12)
            osc2.frequency.exponentialRampToValueAtTime(
              freq2 * 0.8,
              ctx.currentTime + 0.25
            )

            const chirp2Gain = ctx.createGain()
            chirp2Gain.gain.setValueAtTime(0, ctx.currentTime + 0.12)
            chirp2Gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.14)
            chirp2Gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

            osc2.connect(chirp2Gain).connect(masterGain)
            osc2.start(ctx.currentTime + 0.12)
            osc2.stop(ctx.currentTime + 0.35)
          }

          scheduleChirp()
        }, delay * 1000)
      }

      /* Inicia ciclo de chirps com delay inicial aleatório */
      scheduleChirp()
    }

    /* Listener para iniciar áudio na primeira interação do usuário */
    window.addEventListener('click', startAudio, { once: true })
    window.addEventListener('keydown', startAudio, { once: true })

    return () => {
      window.removeEventListener('click', startAudio)
      window.removeEventListener('keydown', startAudio)
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        ctxRef.current.close()
      }
    }
  }, [])

  /* Componente invisível — só áudio, sem render */
  return null
}
