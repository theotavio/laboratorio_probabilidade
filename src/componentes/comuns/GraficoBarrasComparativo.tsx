import React from 'react'

export interface ItemComparativoGrafico {
  chave: string | number
  rotulo: string
  probabilidadeTeorica: number
  frequenciaExperimental: number
  quantidadeOcorrencias: number
  destaque?: boolean
}

interface PropriedadesGraficoBarrasComparativo {
  itens: ItemComparativoGrafico[]
  totalExperimentos: number
  itemSelecionado?: string | number | null
  aoSelecionarItem?: (chave: string | number) => void
  rotuloEixoX?: string
}

export const GraficoBarrasComparativo: React.FC<PropriedadesGraficoBarrasComparativo> = ({
  itens,
  totalExperimentos,
  itemSelecionado,
  aoSelecionarItem,
  rotuloEixoX = 'Resultado',
}) => {
  const maiorProbabilidade = Math.max(
    ...itens.map((item) => Math.max(item.probabilidadeTeorica, item.frequenciaExperimental)),
    0.1
  )

  return (
    <div className="w-full bg-white border border-gray-300 p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-3 border-b border-gray-200">
        <div>
          <h4 className="text-sm font-bold text-gray-900">Comparação: Teoria vs Experimento</h4>
          <p className="text-xs text-gray-600">
            Total de testes realizados: <span className="font-semibold text-gray-900">{totalExperimentos}</span>
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-blue-200 border border-blue-400 inline-block" />
            <span className="text-gray-700">Teórico (Calculado)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-blue-600 inline-block" />
            <span className="text-gray-700">Experimental (Obtido)</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[320px] flex items-end justify-between gap-1 sm:gap-2 h-44 pt-6">
          {itens.map((item) => {
            const alturaTeorica = (item.probabilidadeTeorica / maiorProbabilidade) * 100
            const alturaExperimental =
              totalExperimentos > 0 ? (item.frequenciaExperimental / maiorProbabilidade) * 100 : 0
            const estaAtivo = itemSelecionado === item.chave

            return (
              <div
                key={String(item.chave)}
                onClick={() => aoSelecionarItem && aoSelecionarItem(item.chave)}
                className={`flex-1 flex flex-col items-center justify-end h-full p-1 transition-colors cursor-pointer border ${
                  estaAtivo
                    ? 'bg-blue-50 border-blue-500'
                    : 'border-transparent hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="w-full flex items-end justify-center gap-1 h-28">
                  <div
                    style={{ height: `${Math.max(4, alturaTeorica)}%` }}
                    className="w-1/2 max-w-[14px] bg-blue-200 border border-blue-400"
                    title={`Teórico: ${(item.probabilidadeTeorica * 100).toFixed(1)}%`}
                  />
                  <div
                    style={{ height: `${Math.max(totalExperimentos > 0 ? 4 : 0, alturaExperimental)}%` }}
                    className="w-1/2 max-w-[14px] bg-blue-600"
                    title={`Experimental: ${(item.frequenciaExperimental * 100).toFixed(1)}% (${item.quantidadeOcorrencias} vezes)`}
                  />
                </div>

                <div className="mt-2 text-center w-full">
                  <span className={`block text-xs font-bold ${estaAtivo ? 'text-blue-700' : 'text-gray-900'}`}>
                    {item.rotulo}
                  </span>
                  <div className="text-[10px] text-gray-600 font-mono">
                    {totalExperimentos > 0 ? `${(item.frequenciaExperimental * 100).toFixed(0)}%` : '-'}
                  </div>
                  <div className="text-[9px] text-blue-700 font-mono">
                    T: {(item.probabilidadeTeorica * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-2 text-center text-xs text-gray-500 border-t border-gray-200 pt-2">
        {rotuloEixoX}
      </div>
    </div>
  )
}
