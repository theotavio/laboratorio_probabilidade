import React, { useRef, useEffect, useState, useCallback } from 'react'
import type { DadoFisico } from '../../tipos/probabilidade'

interface PropriedadesCanvasDados {
  quantidadeDados: number
  aoConcluirLancamento: (valores: number[], soma: number) => void
  aoSimularLote: (quantidade: number) => void
}

export const CanvasDados: React.FC<PropriedadesCanvasDados> = ({
  quantidadeDados,
  aoConcluirLancamento,
  aoSimularLote,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animacaoIdRef = useRef<number | null>(null)
  const [estaRolando, setEstaRolando] = useState(false)
  const [valoresAtuais, setValoresAtuais] = useState<number[]>([1, 1])
  const [somaAtual, setSomaAtual] = useState<number>(2)

  const dadosFisicosRef = useRef<DadoFisico[]>([])

  const desenharPontosDado = (
    contexto: CanvasRenderingContext2D,
    x: number,
    y: number,
    tamanho: number,
    valor: number
  ) => {
    const raioPonto = tamanho * 0.08
    const espacamento = tamanho * 0.25

    contexto.fillStyle = '#0f172a'

    const posicoes: Record<number, [number, number][]> = {
      1: [[0, 0]],
      2: [[-espacamento, -espacamento], [espacamento, espacamento]],
      3: [[-espacamento, -espacamento], [0, 0], [espacamento, espacamento]],
      4: [
        [-espacamento, -espacamento],
        [espacamento, -espacamento],
        [-espacamento, espacamento],
        [espacamento, espacamento],
      ],
      5: [
        [-espacamento, -espacamento],
        [espacamento, -espacamento],
        [0, 0],
        [-espacamento, espacamento],
        [espacamento, espacamento],
      ],
      6: [
        [-espacamento, -espacamento],
        [espacamento, -espacamento],
        [-espacamento, 0],
        [espacamento, 0],
        [-espacamento, espacamento],
        [espacamento, espacamento],
      ],
    }

    const pontos = posicoes[valor] || []
    for (const [px, py] of pontos) {
      contexto.beginPath()
      contexto.arc(x + px, y + py, raioPonto, 0, Math.PI * 2)
      contexto.fill()
    }
  }

  const desenharDado = (contexto: CanvasRenderingContext2D, dado: DadoFisico) => {
    const tamanho = 60

    contexto.save()
    contexto.translate(dado.x, dado.y)
    contexto.rotate(dado.angulo)

    contexto.shadowColor = 'rgba(0, 0, 0, 0.15)'
    contexto.shadowBlur = 6
    contexto.shadowOffsetX = 3
    contexto.shadowOffsetY = 4

    contexto.fillStyle = '#ffffff'
    contexto.fillRect(-tamanho / 2, -tamanho / 2, tamanho, tamanho)

    contexto.shadowColor = 'transparent'

    contexto.strokeStyle = '#334155'
    contexto.lineWidth = 2
    contexto.strokeRect(-tamanho / 2, -tamanho / 2, tamanho, tamanho)

    desenharPontosDado(contexto, 0, 0, tamanho, dado.valor)

    contexto.restore()
  }

  const inicializarDados = useCallback(() => {
    const novosDados: DadoFisico[] = []
    const largura = canvasRef.current?.width || 600
    const altura = canvasRef.current?.height || 220

    for (let i = 0; i < quantidadeDados; i++) {
      const espaco = largura / (quantidadeDados + 1)
      const posX = espaco * (i + 1)
      const posY = altura / 2
      novosDados.push({
        id: `dado-${i}`,
        valor: i + 1 <= 6 ? i + 1 : Math.floor(Math.random() * 6) + 1,
        x: posX,
        y: posY,
        velocidadeX: 0,
        velocidadeY: 0,
        angulo: 0,
        velocidadeAngular: 0,
        emMovimento: false,
      })
    }

    dadosFisicosRef.current = novosDados
    const valoresIniciais = novosDados.map((d) => d.valor)
    setValoresAtuais(valoresIniciais)
    setSomaAtual(valoresIniciais.reduce((a, b) => a + b, 0))
  }, [quantidadeDados])

  const rolarDados = () => {
    if (estaRolando) return
    setEstaRolando(true)

    const largura = canvasRef.current?.width || 600
    const altura = canvasRef.current?.height || 220
    const valoresFinais: number[] = []

    dadosFisicosRef.current = dadosFisicosRef.current.map((dado) => {
      const valorFinal = Math.floor(Math.random() * 6) + 1
      valoresFinais.push(valorFinal)

      const forcaX = (Math.random() - 0.5) * 20
      const forcaY = (Math.random() - 0.5) * 18
      const giro = (Math.random() - 0.5) * 0.4

      return {
        ...dado,
        valor: valorFinal,
        velocidadeX: forcaX,
        velocidadeY: forcaY,
        velocidadeAngular: giro,
        emMovimento: true,
      }
    })

    const momentoInicio = performance.now()
    const duracaoAnimacao = 1300

    const animar = (tempoAtual: number) => {
      const decorrido = tempoAtual - momentoInicio
      const progresso = Math.min(decorrido / duracaoAnimacao, 1)

      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const atrito = 0.965
      const margem = 40

      let aindaMovendo = false

      dadosFisicosRef.current.forEach((dado) => {
        if (progresso < 1) {
          dado.x += dado.velocidadeX
          dado.y += dado.velocidadeY
          dado.angulo += dado.velocidadeAngular

          dado.velocidadeX *= atrito
          dado.velocidadeY *= atrito
          dado.velocidadeAngular *= atrito

          if (dado.x - margem < 0) {
            dado.x = margem
            dado.velocidadeX = -dado.velocidadeX * 0.7
          } else if (dado.x + margem > largura) {
            dado.x = largura - margem
            dado.velocidadeX = -dado.velocidadeX * 0.7
          }

          if (dado.y - margem < 0) {
            dado.y = margem
            dado.velocidadeY = -dado.velocidadeY * 0.7
          } else if (dado.y + margem > altura) {
            dado.y = altura - margem
            dado.velocidadeY = -dado.velocidadeY * 0.7
          }

          if (Math.random() < 0.35 * (1 - progresso)) {
            dado.valor = Math.floor(Math.random() * 6) + 1
          }

          aindaMovendo = true
        } else {
          dado.emMovimento = false
        }

        desenharDado(ctx, dado)
      })

      if (aindaMovendo && progresso < 1) {
        animacaoIdRef.current = requestAnimationFrame(animar)
      } else {
        dadosFisicosRef.current.forEach((dado, indice) => {
          dado.valor = valoresFinais[indice]
          dado.emMovimento = false
        })

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        dadosFisicosRef.current.forEach((dado) => desenharDado(ctx, dado))

        setValoresAtuais(valoresFinais)
        const soma = valoresFinais.reduce((acc, val) => acc + val, 0)
        setSomaAtual(soma)
        setEstaRolando(false)
        aoConcluirLancamento(valoresFinais, soma)
      }
    }

    if (animacaoIdRef.current) cancelAnimationFrame(animacaoIdRef.current)
    animacaoIdRef.current = requestAnimationFrame(animar)
  }

  useEffect(() => {
    const ajustarTamanho = () => {
      if (containerRef.current && canvasRef.current) {
        const larguraContainer = containerRef.current.clientWidth
        canvasRef.current.width = larguraContainer
        canvasRef.current.height = 200
        inicializarDados()
      }
    }

    ajustarTamanho()
    window.addEventListener('resize', ajustarTamanho)
    return () => window.removeEventListener('resize', ajustarTamanho)
  }, [inicializarDados])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    dadosFisicosRef.current.forEach((dado) => desenharDado(ctx, dado))
  }, [valoresAtuais])

  return (
    <div className="flex flex-col items-center w-full">
      <div
        ref={containerRef}
        className="relative w-full border border-gray-300 bg-gray-50 overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="w-full h-[200px] block cursor-pointer select-none"
          onClick={rolarDados}
        />

        <div className="absolute top-2 right-2 bg-white border border-gray-300 px-3 py-1 shadow-xs">
          <span className="text-xs text-gray-500 mr-1.5">Soma:</span>
          <span className="text-base font-bold text-gray-900 font-mono">{somaAtual}</span>
          <span className="text-xs text-gray-500 ml-1.5 font-mono">
            ({valoresAtuais.join(' + ')})
          </span>
        </div>

        <div className="absolute bottom-2 left-2 text-[11px] text-gray-500 pointer-events-none">
          Clique no espaço acima para lançar os dados
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-3 w-full">
        <button
          onClick={rolarDados}
          disabled={estaRolando}
          className="px-4 py-2 text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer disabled:opacity-50"
        >
          Lançar {quantidadeDados} Dado{quantidadeDados > 1 ? 's' : ''}
        </button>

        <button
          onClick={() => aoSimularLote(10)}
          disabled={estaRolando}
          className="px-3 py-2 text-xs font-medium bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 transition-colors cursor-pointer disabled:opacity-50"
        >
          +10 Lançamentos
        </button>

        <button
          onClick={() => aoSimularLote(100)}
          disabled={estaRolando}
          className="px-3 py-2 text-xs font-medium bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 transition-colors cursor-pointer disabled:opacity-50"
        >
          +100 Lançamentos
        </button>

        <button
          onClick={() => aoSimularLote(1000)}
          disabled={estaRolando}
          className="px-3 py-2 text-xs font-medium bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 transition-colors cursor-pointer disabled:opacity-50"
        >
          +1000 Lançamentos
        </button>
      </div>
    </div>
  )
}
