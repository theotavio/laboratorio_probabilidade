import React from 'react'

interface PropriedadesMatrizEspacoAmostral {
  quantidadeDados: number
  somaSelecionada: number | null
  aoSelecionarSoma: (soma: number) => void
}

export const MatrizEspacoAmostral: React.FC<PropriedadesMatrizEspacoAmostral> = ({
  quantidadeDados,
  somaSelecionada,
  aoSelecionarSoma,
}) => {
  if (quantidadeDados === 1) {
    return (
      <div className="bg-white p-4 border border-gray-300">
        <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
          <h4 className="text-sm font-bold text-gray-900">Espaço Amostral de 1 Dado (6 possibilidades)</h4>
          <span className="text-xs text-gray-600 font-mono">Total: 6 faces</span>
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((face) => {
            const estaAtivo = somaSelecionada === face
            return (
              <button
                key={face}
                onClick={() => aoSelecionarSoma(face)}
                className={`flex flex-col items-center justify-center p-2.5 border transition-colors cursor-pointer ${
                  estaAtivo
                    ? 'bg-blue-600 text-white border-blue-700'
                    : 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100'
                }`}
              >
                <span className="text-base font-bold font-mono">{face}</span>
                <span className="text-[10px] text-gray-500 mt-0.5">1/6</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (quantidadeDados === 3) {
    return (
      <div className="bg-white p-4 border border-gray-300">
        <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
          <h4 className="text-sm font-bold text-gray-900">Espaço Amostral de 3 Dados</h4>
          <span className="text-xs text-blue-700 font-mono font-semibold">216 possibilidades</span>
        </div>
        <p className="text-xs text-gray-600 mb-3 leading-relaxed">
          Com 3 dados, as somas variam de 3 até 18. As somas centrais 10 e 11 são as mais frequentes, pois possuem 27 combinações cada.
        </p>
        <div className="flex flex-wrap gap-1 justify-center">
          {Array.from({ length: 16 }, (_, i) => i + 3).map((soma) => {
            const estaAtivo = somaSelecionada === soma
            return (
              <button
                key={soma}
                onClick={() => aoSelecionarSoma(soma)}
                className={`px-2 py-1 text-xs font-mono font-semibold border cursor-pointer transition-colors ${
                  estaAtivo
                    ? 'bg-blue-600 text-white border-blue-700'
                    : 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-gray-100'
                }`}
              >
                Soma {soma}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 border border-gray-300">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-gray-200 pb-2">
        <div>
          <h4 className="text-sm font-bold text-gray-900">Espaço Amostral: 2 Dados (36 pares)</h4>
          <p className="text-xs text-gray-500">Linha = Dado 1 | Coluna = Dado 2</p>
        </div>
        {somaSelecionada && (
          <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200">
            Soma {somaSelecionada}
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[320px]">
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
            <div className="p-1 font-bold text-gray-400 flex items-center justify-center">
              D1 \ D2
            </div>
            {[1, 2, 3, 4, 5, 6].map((coluna) => (
              <div key={`col-${coluna}`} className="p-1 font-bold text-gray-700 bg-gray-100 border border-gray-200">
                {coluna}
              </div>
            ))}

            {[1, 2, 3, 4, 5, 6].map((linha) => (
              <React.Fragment key={`linha-${linha}`}>
                <div className="p-1 font-bold text-gray-700 bg-gray-100 border border-gray-200 flex items-center justify-center">
                  {linha}
                </div>
                {[1, 2, 3, 4, 5, 6].map((coluna) => {
                  const soma = linha + coluna
                  const estaAtivo = somaSelecionada === soma

                  return (
                    <button
                      key={`celula-${linha}-${coluna}`}
                      onClick={() => aoSelecionarSoma(soma)}
                      className={`p-1 flex flex-col items-center justify-center border transition-colors cursor-pointer ${
                        estaAtivo
                          ? 'bg-blue-600 text-white font-bold border-blue-700'
                          : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                      }`}
                      title={`Dado 1: ${linha}, Dado 2: ${coluna} => Soma: ${soma}`}
                    >
                      <span className="text-xs font-bold leading-tight">{soma}</span>
                      <span className={`text-[9px] ${estaAtivo ? 'text-blue-100' : 'text-gray-400'}`}>
                        ({linha},{coluna})
                      </span>
                    </button>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
