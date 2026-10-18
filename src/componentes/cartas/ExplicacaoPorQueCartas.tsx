import React from 'react'
import { CartaoExplicativo } from '../comuns/CartaoExplicativo'
import type { EventoCarta } from '../../tipos/probabilidade'
import { formatarFracao, formatarPorcentagem } from '../../utilitarios/calculosProbabilidade'

interface PropriedadesExplicacaoPorQueCartas {
  evento: EventoCarta
  totalCasosFavoraveis: number
  totalCartasBaralho: number
  comReposicao: boolean
  totalTiradas: number
  totalSucessos: number
}

export const ExplicacaoPorQueCartas: React.FC<PropriedadesExplicacaoPorQueCartas> = ({
  evento,
  totalCasosFavoraveis,
  totalCartasBaralho,
  comReposicao,
  totalTiradas,
  totalSucessos,
}) => {
  const chanceTeorica = totalCartasBaralho > 0 ? totalCasosFavoraveis / totalCartasBaralho : 0
  const chanceExperimental = totalTiradas > 0 ? totalSucessos / totalTiradas : 0

  return (
    <CartaoExplicativo
      titulo={`Por que a chance de ${evento.titulo.toLowerCase()} é de ${formatarPorcentagem(chanceTeorica)}?`}
      subtitulo="Estrutura do Baralho de 52 Cartas"
    >
      <p>
        O baralho possui 52 cartas distribuídas em 4 naipes (Copas, Ouros, Espadas e Paus) de 13 cartas cada.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2 text-xs">
        <div className="p-2.5 bg-gray-50 border border-gray-200 space-y-1">
          <div className="font-bold text-gray-900">Cálculo Teórico:</div>
          <div className="font-mono text-gray-700">
            Casos favoráveis: <span className="font-bold text-gray-900">{totalCasosFavoraveis}</span> cartas
          </div>
          <div className="font-mono text-gray-700">
            Total no baralho: <span className="font-bold text-gray-900">{totalCartasBaralho}</span> cartas
          </div>
          <div className="font-mono text-blue-700 font-bold pt-1">
            P = {totalCasosFavoraveis}/{totalCartasBaralho} = {formatarFracao(totalCasosFavoraveis, totalCartasBaralho)} ({formatarPorcentagem(chanceTeorica)})
          </div>
        </div>

        <div className="p-2.5 bg-gray-50 border border-gray-200 space-y-1">
          <div className="font-bold text-gray-900">
            Modo: {comReposicao ? 'Com Reposição' : 'Sem Reposição'}
          </div>
          <p className="text-gray-600">
            {comReposicao
              ? 'A carta sorteada retorna ao baralho, mantendo o total em 52 cartas em cada jogada.'
              : 'A carta retirada permanece fora do monte. O total de cartas diminui a cada retirada (52 -> 51 -> 50...).'}
          </p>
        </div>
      </div>

      {totalTiradas > 0 && (
        <div className="p-2 bg-blue-50 border border-blue-200 text-xs mt-2">
          <div className="font-semibold text-gray-900 mb-0.5">Seus Resultados:</div>
          <p className="text-gray-700">
            Em {totalTiradas} retirada(s), o evento ocorreu {totalSucessos} vez(es) ({formatarPorcentagem(chanceExperimental)} obtido contra {formatarPorcentagem(chanceTeorica)} calculado).
          </p>
        </div>
      )}
    </CartaoExplicativo>
  )
}
