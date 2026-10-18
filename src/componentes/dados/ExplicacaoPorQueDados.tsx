import React from 'react'
import { CartaoExplicativo } from '../comuns/CartaoExplicativo'
import { obterCombinacoesDoisDados, formatarFracao, formatarPorcentagem } from '../../utilitarios/calculosProbabilidade'

interface PropriedadesExplicacaoPorQueDados {
  quantidadeDados: number
  somaSelecionada: number | null
  totalLancamentos: number
  frequenciaObservadaSoma: number
}

export const ExplicacaoPorQueDados: React.FC<PropriedadesExplicacaoPorQueDados> = ({
  quantidadeDados,
  somaSelecionada,
  totalLancamentos,
  frequenciaObservadaSoma,
}) => {
  const mapaCombinacoes = obterCombinacoesDoisDados()
  const somaAlvo = somaSelecionada || (quantidadeDados === 2 ? 7 : quantidadeDados === 1 ? 4 : 10)

  if (quantidadeDados === 1) {
    const chanceTeorica = 1 / 6
    const chanceExperimental = totalLancamentos > 0 ? frequenciaObservadaSoma / totalLancamentos : 0

    return (
      <CartaoExplicativo
        titulo={`Por que a face ${somaAlvo} tem 1/6 de chance?`}
        subtitulo="Eventos Equiprováveis num dado honesto de 6 faces"
      >
        <p>
          Um dado comum possui 6 faces iguais numeradas de 1 a 6. Como todas as faces possuem a mesma chance física de cair voltadas para cima, dizemos que são eventos equiprováveis.
        </p>
        <div className="p-2.5 bg-gray-50 border border-gray-200 my-2 font-mono text-xs">
          <div>Probabilidade = Casos Favoráveis / Casos Possíveis</div>
          <div className="text-blue-800 font-semibold mt-1">
            P(Face {somaAlvo}) = 1 / 6 ≈ {formatarPorcentagem(chanceTeorica)}
          </div>
        </div>
        {totalLancamentos > 0 && (
          <p className="text-xs text-gray-600 mt-2">
            Em seus testes ({totalLancamentos} lançamentos), a face {somaAlvo} saiu {frequenciaObservadaSoma} vez(es) ({formatarPorcentagem(chanceExperimental)}).
          </p>
        )}
      </CartaoExplicativo>
    )
  }

  if (quantidadeDados === 2) {
    const combinacoes = mapaCombinacoes[somaAlvo] || []
    const quantidadeCombinacoes = combinacoes.length
    const chanceTeorica = quantidadeCombinacoes / 36
    const chanceExperimental = totalLancamentos > 0 ? frequenciaObservadaSoma / totalLancamentos : 0

    const combinacoesSoma7 = mapaCombinacoes[7]
    const combinacoesSoma2 = mapaCombinacoes[2]

    return (
      <CartaoExplicativo
        titulo={`Por que a soma ${somaAlvo} tem ${quantidadeCombinacoes} combinação(ões) em 36?`}
        subtitulo="Entendendo as combinações possíveis de dois dados"
      >
        <p>
          Ao lançar 2 dados, existem 36 pares ordenados possíveis (6 × 6). Algumas somas possuem mais formas de acontecer do que outras.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2 text-xs">
          <div className="p-2.5 bg-gray-50 border border-gray-200">
            <div className="font-bold text-gray-900 mb-1">
              Combinações da Soma {somaAlvo}:
            </div>
            <div className="font-mono text-gray-700 flex flex-wrap gap-1">
              {combinacoes.map(([d1, d2], idx) => (
                <span key={idx} className="px-1.5 py-0.5 bg-white border border-gray-300">
                  ({d1}+{d2})
                </span>
              ))}
            </div>
            <div className="mt-2 text-gray-600">
              Teórico: <strong className="text-gray-900">{formatarFracao(quantidadeCombinacoes, 36)}</strong> ({formatarPorcentagem(chanceTeorica)})
            </div>
          </div>

          <div className="p-2.5 bg-gray-50 border border-gray-200">
            <div className="font-bold text-gray-900 mb-1">Comparação de Ocorrência:</div>
            <ul className="space-y-1 text-gray-600">
              <li>
                <strong className="text-gray-900">Soma 7:</strong> tem <strong className="text-gray-900">{combinacoesSoma7.length} combinações</strong> (6/36 = 16,7%).
              </li>
              <li>
                <strong className="text-gray-900">Soma 2:</strong> tem apenas <strong className="text-gray-900">{combinacoesSoma2.length} combinação</strong> (1+1, 1/36 = 2,8%).
              </li>
              <li>
                <strong className="text-gray-900">Soma 12:</strong> tem apenas <strong className="text-gray-900">1 combinação</strong> (6+6, 1/36 = 2,8%).
              </li>
            </ul>
          </div>
        </div>

        {totalLancamentos > 0 && (
          <div className="p-2.5 bg-blue-50 border border-blue-200 text-xs">
            <div className="font-semibold text-gray-900 mb-0.5">Seus Testes:</div>
            <p className="text-gray-700">
              Em {totalLancamentos} lançamentos, a soma {somaAlvo} ocorreu {frequenciaObservadaSoma} vez(es) ({formatarPorcentagem(chanceExperimental)} dos testes). Teoria esperada: {formatarPorcentagem(chanceTeorica)}.
            </p>
          </div>
        )}
      </CartaoExplicativo>
    )
  }

  return (
    <CartaoExplicativo
      titulo="Comportamento da Soma de 3 Dados"
      subtitulo="216 combinações possíveis (6 × 6 × 6)"
    >
      <p>
        Com 3 dados, os valores extremos (3 e 18) possuem apenas 1 combinação cada (1 em 216). As somas 10 e 11 são as mais comuns (27 em 216 cada, ou 12,5%), pois possuem muito mais combinações de dados que as formam.
      </p>
    </CartaoExplicativo>
  )
}
