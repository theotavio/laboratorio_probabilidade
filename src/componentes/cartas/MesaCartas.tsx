import React from 'react'
import type { Carta, EventoCarta } from '../../tipos/probabilidade'
import { CartaVisual } from './CartaVisual'

interface PropriedadesMesaCartas {
  baralhoRestante: Carta[]
  cartasNaMesa: Carta[]
  cartasViradas: boolean
  estaEmbaralhando: boolean
  eventoAtual: EventoCarta
  aoEmbaralhar: () => void
  aoPuxarCartas: () => void
  aoSimularLote: (quantidade: number) => void
  aoResetarBaralho: () => void
  totalRestante: number
  comReposicao: boolean
}

export const MesaCartas: React.FC<PropriedadesMesaCartas> = ({
  baralhoRestante,
  cartasNaMesa,
  cartasViradas,
  estaEmbaralhando,
  eventoAtual,
  aoEmbaralhar,
  aoPuxarCartas,
  aoSimularLote,
  aoResetarBaralho,
  totalRestante,
  comReposicao,
}) => {
  return (
    <div className="flex flex-col items-center w-full space-y-3">
      <div className="w-full min-h-[260px] p-4 bg-gray-50 border border-gray-300 relative flex flex-col justify-between">
        <div className="flex items-center justify-between w-full pb-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`relative transition-transform duration-200 ${estaEmbaralhando ? 'rotate-3 scale-95' : ''}`}>
              <div className="w-12 h-16 bg-blue-900 border border-blue-950 flex items-center justify-center text-white font-mono font-bold text-xs shadow-xs">
                {totalRestante}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase">
                Monte de Cartas
              </div>
              <div className="text-xs sm:text-sm text-gray-900 font-mono">
                {comReposicao ? 'Espaço Fixo: 52 cartas' : `Restam no monte: ${totalRestante}/52`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={aoEmbaralhar}
              disabled={estaEmbaralhando}
              className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 text-xs font-medium cursor-pointer disabled:opacity-50"
            >
              Embaralhar
            </button>
            {!comReposicao && totalRestante < 52 && (
              <button
                onClick={aoResetarBaralho}
                className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 text-xs font-medium cursor-pointer"
              >
                Resetar (52)
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center py-5">
          {cartasNaMesa.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {cartasNaMesa.map((carta, index) => {
                const atendeAoEvento = eventoAtual.filtro(carta)
                return (
                  <div key={`${carta.id}-${index}`} className="flex flex-col items-center gap-1.5">
                    <CartaVisual
                      carta={carta}
                      viradaParaCima={cartasViradas}
                      tamanho="grande"
                      destaque={atendeAoEvento && cartasViradas}
                    />
                    {cartasViradas && (
                      <span
                        className={`text-[11px] px-2 py-0.5 font-bold border ${
                          atendeAoEvento
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-gray-100 text-gray-600 border-gray-300'
                        }`}
                      >
                        {atendeAoEvento ? 'Atende ao Evento' : 'Não Atende'}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 text-xs">
              Mesa vazia. Clique em "Puxar Cartas" para retirar cartas do baralho.
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-gray-200">
          <button
            onClick={aoPuxarCartas}
            disabled={estaEmbaralhando || (!comReposicao && totalRestante === 0)}
            className="px-4 py-2 text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            Puxar Carta{cartasNaMesa.length > 1 ? 's' : ''}
          </button>

          <button
            onClick={() => aoSimularLote(10)}
            disabled={estaEmbaralhando}
            className="px-3 py-2 text-xs font-medium bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 transition-colors cursor-pointer disabled:opacity-50"
          >
            +10 Retiradas
          </button>

          <button
            onClick={() => aoSimularLote(100)}
            disabled={estaEmbaralhando}
            className="px-3 py-2 text-xs font-medium bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 transition-colors cursor-pointer disabled:opacity-50"
          >
            +100 Retiradas
          </button>
        </div>
      </div>

      <div className="w-full bg-white p-3 border border-gray-300">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            Espaço Amostral (52 Cartas)
          </h4>
          <span className="text-[11px] text-blue-700 font-semibold">
            Cartas com fundo azul atendem ao evento
          </span>
        </div>

        <div className="grid grid-cols-13 gap-1 overflow-x-auto py-1">
          {baralhoRestante.slice(0, 52).map((carta) => {
            const ehFavoravel = eventoAtual.filtro(carta)
            const simbolo =
              carta.naipe === 'copas'
                ? '♥'
                : carta.naipe === 'ouros'
                ? '♦'
                : carta.naipe === 'espadas'
                ? '♠'
                : '♣'

            return (
              <div
                key={`amostra-${carta.id}`}
                className={`p-1 text-center font-mono text-[10px] border transition-colors ${
                  ehFavoravel
                    ? 'bg-blue-50 text-blue-900 border-blue-500 font-bold'
                    : 'bg-gray-50 text-gray-500 border-gray-200'
                }`}
                title={`${carta.valor} de ${carta.naipe}`}
              >
                <span>{carta.valor}</span>
                <span className={carta.cor === 'vermelha' ? 'text-red-600' : 'text-gray-900'}>
                  {simbolo}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
