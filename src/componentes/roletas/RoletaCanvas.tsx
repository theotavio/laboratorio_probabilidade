import React, { useRef, useEffect, useState } from 'react'
import type { SetorRoleta } from '../../tipos/probabilidade'

interface PropriedadesRoletaCanvas {
  setores: SetorRoleta[]
  estaGirando: boolean
  aoIniciarGiro: () => void
  aoFinalizarGiro: (setorSorteado: SetorRoleta) => void
  aoSimularGirosEmLote: (quantidade: number) => void
}

export const RoletaCanvas: React.FC<PropriedadesRoletaCanvas> = ({
  setores,
  estaGirando,
  aoIniciarGiro,
  aoFinalizarGiro,
  aoSimularGirosEmLote,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const anguloAtualRef = useRef<number>(0)
  const animacaoIdRef = useRef<number | null>(null)
  const oscilacaoAgulhaRef = useRef<number>(0)
  const [ultimoSetorVencedor, setUltimoSetorVencedor] = useState<SetorRoleta | null>(null)

  const desenharRoleta = (contexto: CanvasRenderingContext2D, anguloRotacao: number) => {
    const largura = contexto.canvas.width
    const altura = contexto.canvas.height
    const centroX = largura / 2
    const centroY = altura / 2
    const raio = Math.min(centroX, centroY) - 18

    contexto.clearRect(0, 0, largura, altura)

    contexto.save()
    contexto.translate(centroX, centroY)

    contexto.beginPath()
    contexto.arc(0, 0, raio + 4, 0, Math.PI * 2)
    contexto.fillStyle = '#e2e8f0'
    contexto.fill()
    contexto.strokeStyle = '#94a3b8'
    contexto.lineWidth = 2
    contexto.stroke()

    contexto.save()
    contexto.rotate(anguloRotacao)

    setores.forEach((setor) => {
      const inicio = setor.anguloInicio ?? 0
      const fim = setor.anguloFim ?? 0

      contexto.beginPath()
      contexto.moveTo(0, 0)
      contexto.arc(0, 0, raio, inicio, fim)
      contexto.closePath()
      contexto.fillStyle = setor.cor
      contexto.fill()

      contexto.strokeStyle = '#ffffff'
      contexto.lineWidth = 1.5
      contexto.stroke()

      const anguloMedio = (inicio + fim) / 2
      contexto.save()
      contexto.rotate(anguloMedio)

      contexto.textAlign = 'right'
      contexto.textBaseline = 'middle'
      contexto.fillStyle = '#ffffff'
      contexto.font = 'bold 12px sans-serif'

      const texto = `${setor.nome} (${(setor.probabilidadeTeorica * 100).toFixed(0)}%)`
      contexto.fillText(texto, raio - 12, 0)

      contexto.restore()
    })

    const totalPinos = Math.max(setores.length * 4, 16)
    for (let i = 0; i < totalPinos; i++) {
      const angPino = (i / totalPinos) * Math.PI * 2
      const px = Math.cos(angPino) * (raio - 3)
      const py = Math.sin(angPino) * (raio - 3)

      contexto.beginPath()
      contexto.arc(px, py, 2.5, 0, Math.PI * 2)
      contexto.fillStyle = '#334155'
      contexto.fill()
    }

    contexto.restore()

    contexto.beginPath()
    contexto.arc(0, 0, 18, 0, Math.PI * 2)
    contexto.fillStyle = '#ffffff'
    contexto.fill()
    contexto.strokeStyle = '#475569'
    contexto.lineWidth = 2
    contexto.stroke()

    contexto.restore()

    contexto.save()
    contexto.translate(centroX, centroY - raio)
    contexto.rotate(oscilacaoAgulhaRef.current)

    contexto.beginPath()
    contexto.moveTo(-8, -14)
    contexto.lineTo(8, -14)
    contexto.lineTo(0, 12)
    contexto.closePath()
    contexto.fillStyle = '#dc2626'
    contexto.fill()

    contexto.strokeStyle = '#ffffff'
    contexto.lineWidth = 1.5
    contexto.stroke()

    contexto.restore()
  }

  const girarRoleta = () => {
    if (estaGirando || setores.length === 0) return
    aoIniciarGiro()

    const pesoTotal = setores.reduce((acc, s) => acc + Math.max(0, s.peso), 0)
    let aleatorio = Math.random() * pesoTotal
    let setorEscolhido = setores[0]

    for (const setor of setores) {
      if (aleatorio <= setor.peso) {
        setorEscolhido = setor
        break
      }
      aleatorio -= setor.peso
    }

    const angInicio = setorEscolhido.anguloInicio ?? 0
    const angFim = setorEscolhido.anguloFim ?? (angInicio + Math.PI / 2)
    const anguloNoSetor = angInicio + Math.random() * (angFim - angInicio)

    const anguloAlvoNormalizado = (3 * Math.PI / 2 - anguloNoSetor + Math.PI * 4) % (Math.PI * 2)

    const girosCompletos = 5 + Math.floor(Math.random() * 4)
    const anguloInicial = anguloAtualRef.current % (Math.PI * 2)
    let delta = anguloAlvoNormalizado - anguloInicial
    if (delta < 0) delta += Math.PI * 2

    const distanciaTotal = girosCompletos * Math.PI * 2 + delta
    const anguloFinal = anguloAtualRef.current + distanciaTotal

    const duracao = 3400
    const inicioTempo = performance.now()

    const animar = (tempoAtual: number) => {
      const decorrido = tempoAtual - inicioTempo
      const t = Math.min(decorrido / duracao, 1)

      const easeOut = 1 - Math.pow(1 - t, 3.5)
      const anguloAgora = anguloAtualRef.current + distanciaTotal * easeOut

      if (t < 0.85) {
        oscilacaoAgulhaRef.current = Math.sin(decorrido * 0.04) * (1 - t) * 0.2
      } else {
        oscilacaoAgulhaRef.current = 0
      }

      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) desenharRoleta(ctx, anguloAgora)
      }

      if (t < 1) {
        animacaoIdRef.current = requestAnimationFrame(animar)
      } else {
        anguloAtualRef.current = anguloFinal
        oscilacaoAgulhaRef.current = 0

        const ctx = canvas?.getContext('2d')
        if (ctx && canvas) desenharRoleta(ctx, anguloFinal)

        setUltimoSetorVencedor(setorEscolhido)
        aoFinalizarGiro(setorEscolhido)
      }
    }

    if (animacaoIdRef.current) cancelAnimationFrame(animacaoIdRef.current)
    animacaoIdRef.current = requestAnimationFrame(animar)
  }

  useEffect(() => {
    const ajustarTamanho = () => {
      if (containerRef.current && canvasRef.current) {
        const largura = Math.min(containerRef.current.clientWidth, 340)
        canvasRef.current.width = largura
        canvasRef.current.height = largura
        const ctx = canvasRef.current.getContext('2d')
        if (ctx) desenharRoleta(ctx, anguloAtualRef.current)
      }
    }

    ajustarTamanho()
    window.addEventListener('resize', ajustarTamanho)
    return () => window.removeEventListener('resize', ajustarTamanho)
  }, [setores])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    desenharRoleta(ctx, anguloAtualRef.current)
  }, [setores])

  return (
    <div className="flex flex-col items-center w-full">
      <div
        ref={containerRef}
        className="w-full flex flex-col items-center justify-center p-3 bg-white border border-gray-300 relative"
      >
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          className="max-w-full cursor-pointer select-none"
          onClick={girarRoleta}
        />

        {ultimoSetorVencedor && !estaGirando && (
          <div className="mt-2 bg-gray-50 border border-gray-300 px-3 py-1 text-xs flex items-center gap-2">
            <span
              className="w-3 h-3 inline-block"
              style={{ backgroundColor: ultimoSetorVencedor.cor }}
            />
            <span className="text-gray-600">Último resultado:</span>
            <span className="font-bold text-gray-900">{ultimoSetorVencedor.nome}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-3 w-full">
        <button
          onClick={girarRoleta}
          disabled={estaGirando}
          className="px-4 py-2 text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer disabled:opacity-50"
        >
          {estaGirando ? 'Girando...' : 'Girar Roleta'}
        </button>

        <button
          onClick={() => aoSimularGirosEmLote(10)}
          disabled={estaGirando}
          className="px-3 py-2 text-xs font-medium bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 transition-colors cursor-pointer disabled:opacity-50"
        >
          +10 Giros
        </button>

        <button
          onClick={() => aoSimularGirosEmLote(100)}
          disabled={estaGirando}
          className="px-3 py-2 text-xs font-medium bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 transition-colors cursor-pointer disabled:opacity-50"
        >
          +100 Giros
        </button>
      </div>
    </div>
  )
}
