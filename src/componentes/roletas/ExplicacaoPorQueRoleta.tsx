import React from 'react'
import { CartaoExplicativo } from '../comuns/CartaoExplicativo'
import type { SetorRoleta } from '../../tipos/probabilidade'
import { formatarPorcentagem } from '../../utilitarios/calculosProbabilidade'

interface PropriedadesExplicacaoPorQueRoleta {
  setores: SetorRoleta[]
  totalGiros: number
  historicoGiros: Record<string, number>
}

export const ExplicacaoPorQueRoleta: React.FC<PropriedadesExplicacaoPorQueRoleta> = ({
  setores,
  totalGiros,
  historicoGiros,
}) => {
  const pesoTotal = setores.reduce((acc, s) => acc + Math.max(0, s.peso), 0)

  return (
    <CartaoExplicativo
      titulo="Por que o tamanho do setor define a chance?"
      subtitulo="Probabilidade proporcional ao ângulo central (360°)"
    >
      <p>
        Um círculo completo possui 360°. A probabilidade de a agulha parar em um determinado setor é dada pela razão entre o ângulo do setor e o círculo total:
      </p>

      <div className="p-2.5 bg-gray-50 border border-gray-200 my-2 font-mono text-xs space-y-1">
        <div>Probabilidade = Ângulo do Setor / 360° = Peso do Setor / Peso Total</div>
        <div className="text-gray-900 font-semibold">Peso Total = {pesoTotal} partes</div>
      </div>

      <div className="space-y-1 mt-2">
        {setores.slice(0, 4).map((setor) => {
          const probabilidadeTeorica = pesoTotal > 0 ? setor.peso / pesoTotal : 0
          const angulo = probabilidadeTeorica * 360
          const ocorrencias = historicoGiros[setor.id] || 0
          const experimental = totalGiros > 0 ? ocorrencias / totalGiros : 0

          return (
            <div key={setor.id} className="text-xs flex items-center justify-between p-1.5 bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 border border-gray-400" style={{ backgroundColor: setor.cor }} />
                <span className="font-semibold text-gray-800">{setor.nome}:</span>
                <span className="text-gray-500 font-mono">{angulo.toFixed(0)}°</span>
              </div>
              <div className="text-right font-mono text-gray-700">
                <span>Teórico: {formatarPorcentagem(probabilidadeTeorica)}</span>
                {totalGiros > 0 && (
                  <span className="text-gray-500 ml-1.5">
                    (Real: {formatarPorcentagem(experimental)})
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {totalGiros > 0 && (
        <p className="text-xs text-gray-600 mt-2">
          Após {totalGiros} giro(s), os setores com maior ângulo tendem a acumular proporcionalmente mais paradas.
        </p>
      )}
    </CartaoExplicativo>
  )
}
