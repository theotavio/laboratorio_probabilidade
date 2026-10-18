import React from 'react'
import type { EventoCarta } from '../../tipos/probabilidade'

export const EVENTOS_DISPONIVEIS: EventoCarta[] = [
  {
    id: 'as',
    titulo: 'Retirar um Ás (A)',
    descricao: '4 Ases no baralho completo (1 de cada naipe).',
    filtro: (carta) => carta.valor === 'A',
  },
  {
    id: 'vermelha',
    titulo: 'Retirar Carta Vermelha',
    descricao: 'Todas as cartas de Copas (♥) e Ouros (♦) — 26 cartas.',
    filtro: (carta) => carta.cor === 'vermelha',
  },
  {
    id: 'rei',
    titulo: 'Retirar um Rei (K)',
    descricao: 'Qualquer um dos 4 Reis do baralho.',
    filtro: (carta) => carta.valor === 'K',
  },
  {
    id: 'figura',
    titulo: 'Retirar uma Figura (J, Q ou K)',
    descricao: 'Valetes, Damas e Reis (12 cartas no total).',
    filtro: (carta) => carta.ehFigura,
  },
  {
    id: 'copas',
    titulo: 'Retirar Carta de Copas (♥)',
    descricao: 'Todas as 13 cartas do naipe de Copas.',
    filtro: (carta) => carta.naipe === 'copas',
  },
  {
    id: 'preta-par',
    titulo: 'Retirar Carta Preta e Par',
    descricao: 'Cartas 2, 4, 6, 8 e 10 de Espadas e Paus (10 cartas).',
    filtro: (carta) => carta.cor === 'preta' && carta.valorNumerico % 2 === 0 && carta.valorNumerico <= 10,
  },
]

interface PropriedadesControleEventosCartas {
  eventoSelecionadoId: string
  aoSelecionarEvento: (eventoId: string) => void
  comReposicao: boolean
  aoMudarReposicao: (comReposicao: boolean) => void
  quantidadePorTirada: number
  aoMudarQuantidade: (qtd: number) => void
  desabilitado?: boolean
}

export const ControleEventosCartas: React.FC<PropriedadesControleEventosCartas> = ({
  eventoSelecionadoId,
  aoSelecionarEvento,
  comReposicao,
  aoMudarReposicao,
  quantidadePorTirada,
  aoMudarQuantidade,
  desabilitado = false,
}) => {
  return (
    <div className="bg-white p-4 border border-gray-300 space-y-3">
      <div className="border-b border-gray-200 pb-2">
        <h4 className="text-sm font-bold text-gray-900">Selecione o Evento</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {EVENTOS_DISPONIVEIS.map((evento) => {
          const estaAtivo = eventoSelecionadoId === evento.id
          return (
            <button
              key={evento.id}
              onClick={() => aoSelecionarEvento(evento.id)}
              disabled={desabilitado}
              className={`text-left p-2 border transition-colors cursor-pointer ${
                estaAtivo
                  ? 'bg-blue-50 border-blue-600 text-blue-900 font-semibold'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-800'
              }`}
            >
              <div className="text-xs font-bold">{evento.titulo}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">{evento.descricao}</div>
            </button>
          )
        })}
      </div>

      <div className="pt-2 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Modo de Retirada:</span>
          <div className="flex border border-gray-300 bg-gray-50 p-0.5">
            <button
              type="button"
              onClick={() => aoMudarReposicao(true)}
              disabled={desabilitado}
              className={`px-2.5 py-1 font-semibold transition-colors cursor-pointer ${
                comReposicao
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Com Reposição
            </button>
            <button
              type="button"
              onClick={() => aoMudarReposicao(false)}
              disabled={desabilitado}
              className={`px-2.5 py-1 font-semibold transition-colors cursor-pointer ${
                !comReposicao
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sem Reposição
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-600">Cartas por vez:</span>
          <div className="flex border border-gray-300 bg-gray-50 p-0.5">
            {[1, 2, 3].map((qtd) => (
              <button
                key={qtd}
                type="button"
                onClick={() => aoMudarQuantidade(qtd)}
                disabled={desabilitado}
                className={`px-2.5 py-1 font-bold transition-colors cursor-pointer ${
                  quantidadePorTirada === qtd
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {qtd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
