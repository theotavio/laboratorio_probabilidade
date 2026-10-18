import React from 'react'
import { usarEstatisticas } from '../../contextos/ContextoEstatisticas'
import { formatarPorcentagem } from '../../utilitarios/calculosProbabilidade'

export const TelaEstatisticas: React.FC = () => {
  const { estatisticas, reiniciarTodasEstatisticas } = usarEstatisticas()

  const totalExperimentos =
    estatisticas.totalLancamentosDados +
    estatisticas.totalGirosRoleta +
    estatisticas.totalCartasRetiradas

  const taxaAcertoDesafios =
    estatisticas.totalDesafiosRespondidos > 0
      ? estatisticas.totalAcertosDesafios / estatisticas.totalDesafiosRespondidos
      : 0

  const nivelConvergencia =
    totalExperimentos >= 1000
      ? 'Amostra Ampla (+1000 testes - frequências estabilizadas)'
      : totalExperimentos >= 100
      ? 'Amostra Moderada (+100 testes - aproximação visível)'
      : totalExperimentos >= 20
      ? 'Amostra Inicial (+20 testes - início da convergência)'
      : 'Poucos Testes (oscilações amostrais normais)'

  const porcentagemConvergencia = Math.min(100, Math.round((totalExperimentos / 500) * 100))

  const conquistas = [
    {
      id: 'c-dados',
      titulo: 'Testes com Dados',
      descricao: 'Realizou pelo menos 20 lançamentos de dados',
      atingida: estatisticas.totalLancamentosDados >= 20,
    },
    {
      id: 'c-roleta',
      titulo: 'Testes com Roleta',
      descricao: 'Executou pelo menos 15 giros da roleta',
      atingida: estatisticas.totalGirosRoleta >= 15,
    },
    {
      id: 'c-cartas',
      titulo: 'Testes com Cartas',
      descricao: 'Puxou pelo menos 20 cartas do baralho',
      atingida: estatisticas.totalCartasRetiradas >= 20,
    },
    {
      id: 'c-desafios',
      titulo: 'Resolução de Desafios',
      descricao: 'Acertou pelo menos 4 questões conceituais',
      atingida: estatisticas.totalAcertosDesafios >= 4,
    },
    {
      id: 'c-grandes-numeros',
      titulo: 'Grande Volume Amostral',
      descricao: 'Acumulou mais de 100 testes totais na sessão',
      atingida: totalExperimentos >= 100,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 border border-gray-300">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Estatísticas Gerais</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Registro dos experimentos e convergência pela Lei dos Grandes Números.
          </p>
        </div>

        {totalExperimentos > 0 && (
          <button
            onClick={reiniciarTodasEstatisticas}
            className="px-2.5 py-1 text-xs font-medium border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
          >
            Zerar Estatísticas
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 border border-gray-300">
          <div className="text-xs font-semibold text-gray-500 uppercase">Dados</div>
          <div className="text-2xl font-bold text-gray-900 font-mono mt-1">
            {estatisticas.totalLancamentosDados}
          </div>
          <span className="text-[11px] text-gray-500">Lançamentos</span>
        </div>

        <div className="bg-white p-3.5 border border-gray-300">
          <div className="text-xs font-semibold text-gray-500 uppercase">Roleta</div>
          <div className="text-2xl font-bold text-gray-900 font-mono mt-1">
            {estatisticas.totalGirosRoleta}
          </div>
          <span className="text-[11px] text-gray-500">Giros</span>
        </div>

        <div className="bg-white p-3.5 border border-gray-300">
          <div className="text-xs font-semibold text-gray-500 uppercase">Cartas</div>
          <div className="text-2xl font-bold text-gray-900 font-mono mt-1">
            {estatisticas.totalCartasRetiradas}
          </div>
          <span className="text-[11px] text-gray-500">Retiradas</span>
        </div>

        <div className="bg-white p-3.5 border border-gray-300">
          <div className="text-xs font-semibold text-gray-500 uppercase">Desafios</div>
          <div className="text-2xl font-bold text-gray-900 font-mono mt-1">
            {estatisticas.totalAcertosDesafios}
          </div>
          <span className="text-[11px] text-gray-500">
            {formatarPorcentagem(taxaAcertoDesafios)} de acertos
          </span>
        </div>
      </div>

      <div className="bg-white p-4 border border-gray-300 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
          <h3 className="text-sm font-bold text-gray-900">Lei dos Grandes Números</h3>
          <span className="text-xs text-blue-700 font-mono font-semibold">
            {totalExperimentos} experimentos acumulados
          </span>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          A Lei dos Grandes Números estabelece que, à medida que o número de repetições de um experimento aleatório aumenta, a frequência experimental observada aproxima-se progressivamente da probabilidade teórica matemática.
        </p>

        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Status: {nivelConvergencia}</span>
            <span>{porcentagemConvergencia}% do volume ideal (500+)</span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 border border-gray-300">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${Math.max(4, porcentagemConvergencia)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 border border-gray-300 space-y-3">
        <div className="border-b border-gray-200 pb-2">
          <h3 className="text-sm font-bold text-gray-900">Marcos Atingidos</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {conquistas.map((conquista) => (
            <div
              key={conquista.id}
              className={`p-3 border transition-colors ${
                conquista.atingida
                  ? 'bg-blue-50/50 border-blue-400'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-bold text-gray-900">{conquista.titulo}</h4>
                {conquista.atingida ? (
                  <span className="text-[10px] px-1.5 py-0.2 bg-blue-600 text-white font-bold">
                    Concluído
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400">Pendente</span>
                )}
              </div>
              <p className="text-[11px] text-gray-600 mt-1">{conquista.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
