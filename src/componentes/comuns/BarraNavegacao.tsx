import React from 'react'
import type { AbaNavegacao } from '../../tipos/probabilidade'
import { usarEstatisticas } from '../../contextos/ContextoEstatisticas'

interface PropriedadesBarraNavegacao {
  abaAtiva: AbaNavegacao
  aoMudarAba: (aba: AbaNavegacao) => void
}

export const BarraNavegacao: React.FC<PropriedadesBarraNavegacao> = ({ abaAtiva, aoMudarAba }) => {
  const { estatisticas } = usarEstatisticas()

  const itensAba: { id: AbaNavegacao; rotulo: string }[] = [
    { id: 'dados', rotulo: 'Laboratório de Dados' },
    { id: 'roletas', rotulo: 'Laboratório de Roletas' },
    { id: 'cartas', rotulo: 'Laboratório de Cartas' },
    { id: 'desafios', rotulo: 'Desafios' },
    { id: 'estatisticas', rotulo: 'Estatísticas Gerais' },
  ]

  const totalExperimentos =
    estatisticas.totalLancamentosDados +
    estatisticas.totalGirosRoleta +
    estatisticas.totalCartasRetiradas

  return (
    <header className="border-b border-gray-300 bg-white sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-2">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              Laboratório Interativo de Probabilidade
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span className="bg-gray-100 border border-gray-300 px-2.5 py-1">
              Desafios: <strong className="text-gray-900 font-semibold">{estatisticas.totalAcertosDesafios}</strong> acertos
            </span>
            <span className="bg-gray-100 border border-gray-300 px-2.5 py-1">
              Experimentos: <strong className="text-gray-900 font-semibold">{totalExperimentos}</strong>
            </span>
          </div>
        </div>

        <nav className="flex space-x-1 overflow-x-auto border-t border-gray-200">
          {itensAba.map((item) => {
            const estaSelecionado = abaAtiva === item.id
            return (
              <button
                key={item.id}
                onClick={() => aoMudarAba(item.id)}
                className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                  estaSelecionado
                    ? 'border-blue-600 text-blue-700 font-semibold bg-blue-50/50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.rotulo}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
