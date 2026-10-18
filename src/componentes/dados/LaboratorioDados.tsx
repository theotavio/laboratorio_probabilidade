import React, { useState } from 'react'
import { CanvasDados } from './CanvasDados'
import { MatrizEspacoAmostral } from './MatrizEspacoAmostral'
import { ExplicacaoPorQueDados } from './ExplicacaoPorQueDados'
import { GraficoBarrasComparativo, type ItemComparativoGrafico } from '../comuns/GraficoBarrasComparativo'
import { obterDistribuicoesTeoricasDados } from '../../utilitarios/calculosProbabilidade'
import { usarEstatisticas } from '../../contextos/ContextoEstatisticas'

export const LaboratorioDados: React.FC = () => {
  const [quantidadeDados, setQuantidadeDados] = useState<number>(2)
  const [historicoSomas, setHistoricoSomas] = useState<Record<number, number>>({})
  const [totalLancamentos, setTotalLancamentos] = useState<number>(0)
  const [somaSelecionada, setSomaSelecionada] = useState<number | null>(7)

  const { registrarLancamentoDados } = usarEstatisticas()

  const distribuidosTeoricos = obterDistribuicoesTeoricasDados(quantidadeDados)

  const lidarComLancamento = (_valores: number[], soma: number) => {
    setHistoricoSomas((anterior) => ({
      ...anterior,
      [soma]: (anterior[soma] || 0) + 1,
    }))
    setTotalLancamentos((anterior) => anterior + 1)
    setSomaSelecionada(soma)
    registrarLancamentoDados(soma)
  }

  const simularLote = (quantidade: number) => {
    const novasSomas = { ...historicoSomas }
    let ultimaSoma = 7

    for (let i = 0; i < quantidade; i++) {
      let soma = 0
      for (let d = 0; d < quantidadeDados; d++) {
        soma += Math.floor(Math.random() * 6) + 1
      }
      novasSomas[soma] = (novasSomas[soma] || 0) + 1
      registrarLancamentoDados(soma)
      ultimaSoma = soma
    }

    setHistoricoSomas(novasSomas)
    setTotalLancamentos((anterior) => anterior + quantidade)
    setSomaSelecionada(ultimaSoma)
  }

  const limparHistorico = () => {
    setHistoricoSomas({})
    setTotalLancamentos(0)
    setSomaSelecionada(quantidadeDados === 2 ? 7 : quantidadeDados === 1 ? 1 : 10)
  }

  const mudarQuantidadeDados = (novaQtd: number) => {
    setQuantidadeDados(novaQtd)
    setHistoricoSomas({})
    setTotalLancamentos(0)
    setSomaSelecionada(novaQtd === 2 ? 7 : novaQtd === 1 ? 1 : 10)
  }

  const itensGrafico: ItemComparativoGrafico[] = distribuidosTeoricos.map((item) => {
    const ocorrencias = historicoSomas[item.soma] || 0
    const frequenciaExperimental = totalLancamentos > 0 ? ocorrencias / totalLancamentos : 0

    return {
      chave: item.soma,
      rotulo: `${item.soma}`,
      probabilidadeTeorica: item.probabilidadeTeorica,
      frequenciaExperimental,
      quantidadeOcorrencias: ocorrencias,
      destaque: somaSelecionada === item.soma,
    }
  })

  const frequenciaSomaSelecionada = somaSelecionada ? historicoSomas[somaSelecionada] || 0 : 0

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 border border-gray-300">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Laboratório de Dados</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Lance dados, acompanhe a soma e compare os resultados teóricos com a prática.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center border border-gray-300 bg-gray-50 p-0.5">
            <span className="text-xs text-gray-600 px-2 font-medium">Dados:</span>
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => mudarQuantidadeDados(num)}
                className={`px-2.5 py-1 text-xs font-semibold cursor-pointer transition-colors ${
                  quantidadeDados === num
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {totalLancamentos > 0 && (
            <button
              onClick={limparHistorico}
              className="px-2.5 py-1 text-xs font-medium border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
            >
              Limpar ({totalLancamentos})
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 space-y-4">
          <CanvasDados
            quantidadeDados={quantidadeDados}
            aoConcluirLancamento={lidarComLancamento}
            aoSimularLote={simularLote}
          />

          <GraficoBarrasComparativo
            itens={itensGrafico}
            totalExperimentos={totalLancamentos}
            itemSelecionado={somaSelecionada}
            aoSelecionarItem={(chave) => setSomaSelecionada(Number(chave))}
            rotuloEixoX={`Somas possíveis de ${quantidadeDados} dado(s)`}
          />
        </div>

        <div className="lg:col-span-5 space-y-4">
          <ExplicacaoPorQueDados
            quantidadeDados={quantidadeDados}
            somaSelecionada={somaSelecionada}
            totalLancamentos={totalLancamentos}
            frequenciaObservadaSoma={frequenciaSomaSelecionada}
          />

          <MatrizEspacoAmostral
            quantidadeDados={quantidadeDados}
            somaSelecionada={somaSelecionada}
            aoSelecionarSoma={(soma) => setSomaSelecionada(soma)}
          />
        </div>
      </div>
    </div>
  )
}
