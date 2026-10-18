import React, { useState } from 'react'
import { BANCO_DESAFIOS } from './listaDesafios'
import { usarEstatisticas } from '../../contextos/ContextoEstatisticas'

export const AreaDesafios: React.FC = () => {
  const [indiceAtual, setIndiceAtual] = useState(0)
  const [opcaoSelecionadaId, setOpcaoSelecionadaId] = useState<string | null>(null)
  const [mostrarDica, setMostrarDica] = useState(false)
  const [foiRespondida, setFoiRespondida] = useState(false)

  const { estatisticas, registrarRespostaDesafio } = usarEstatisticas()

  const desafioAtual = BANCO_DESAFIOS[indiceAtual]

  const responder = (idOpcao: string) => {
    if (foiRespondida) return
    setOpcaoSelecionadaId(idOpcao)
    setFoiRespondida(true)

    const opcao = desafioAtual.opcoes.find((o) => o.id === idOpcao)
    const acertou = opcao?.estaCorreta ?? false

    registrarRespostaDesafio(desafioAtual.id, acertou)
  }

  const proximoDesafio = () => {
    setOpcaoSelecionadaId(null)
    setMostrarDica(false)
    setFoiRespondida(false)
    setIndiceAtual((anterior) => (anterior + 1) % BANCO_DESAFIOS.length)
  }

  const selecionarIndice = (indice: number) => {
    setOpcaoSelecionadaId(null)
    setMostrarDica(false)
    setFoiRespondida(false)
    setIndiceAtual(indice)
  }

  const badgeDificuldade = {
    facil: 'bg-green-50 text-green-800 border-green-300',
    medio: 'bg-amber-50 text-amber-800 border-amber-300',
    desafiador: 'bg-red-50 text-red-800 border-red-300',
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 border border-gray-300">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Desafios de Probabilidade</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Responda às questões conceituais sobre dados, roletas e cartas.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 border border-gray-300 text-xs">
          <span className="text-gray-600">Progresso:</span>
          <span className="font-bold text-gray-900 font-mono">
            {estatisticas.totalAcertosDesafios} acertos
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600 font-mono">{BANCO_DESAFIOS.length} questões</span>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {BANCO_DESAFIOS.map((desafio, idx) => {
          const estaAtivo = idx === indiceAtual
          const foiConcluido = estatisticas.desafiosConcluidos.includes(desafio.id)

          return (
            <button
              key={desafio.id}
              onClick={() => selecionarIndice(idx)}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap border ${
                estaAtivo
                  ? 'bg-blue-600 text-white border-blue-700'
                  : foiConcluido
                  ? 'bg-green-50 text-green-800 border-green-300'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              Questão {idx + 1}
            </button>
          )
        })}
      </div>

      <div className="bg-white p-4 sm:p-5 border border-gray-300 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 font-bold uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-300">
              Tema: {desafioAtual.modulo}
            </span>
            <span
              className={`text-xs px-2 py-0.5 font-bold uppercase tracking-wider border ${
                badgeDificuldade[desafioAtual.dificuldade]
              }`}
            >
              {desafioAtual.dificuldade}
            </span>
          </div>
          <span className="text-xs text-gray-500 font-mono">
            Questão {indiceAtual + 1} de {BANCO_DESAFIOS.length}
          </span>
        </div>

        <div>
          <div className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">
            Contexto
          </div>
          <p className="text-xs sm:text-sm text-gray-600 italic mb-2">"{desafioAtual.contexto}"</p>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
            {desafioAtual.pergunta}
          </h3>
        </div>

        <div className="space-y-2">
          {desafioAtual.opcoes.map((opcao) => {
            const foiEstaEscolhida = opcaoSelecionadaId === opcao.id
            let estiloOpcao = 'bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-800'

            if (foiRespondida) {
              if (opcao.estaCorreta) {
                estiloOpcao = 'bg-green-50 border-green-600 text-green-900'
              } else if (foiEstaEscolhida && !opcao.estaCorreta) {
                estiloOpcao = 'bg-red-50 border-red-600 text-red-900'
              } else {
                estiloOpcao = 'bg-gray-50 border-gray-200 opacity-60 text-gray-500'
              }
            }

            return (
              <button
                key={opcao.id}
                onClick={() => responder(opcao.id)}
                disabled={foiRespondida}
                className={`w-full text-left p-3 border transition-colors cursor-pointer disabled:cursor-default ${estiloOpcao}`}
              >
                <div className="text-xs sm:text-sm font-semibold">{opcao.texto}</div>
                {foiRespondida && foiEstaEscolhida && (
                  <p className={`text-xs mt-1.5 font-medium ${opcao.estaCorreta ? 'text-green-800' : 'text-red-800'}`}>
                    {opcao.justificativa}
                  </p>
                )}
              </button>
            )
          })}
        </div>

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200">
          <div>
            {!foiRespondida && (
              <button
                type="button"
                onClick={() => setMostrarDica((ant) => !ant)}
                className="text-xs text-blue-700 hover:text-blue-900 cursor-pointer font-medium"
              >
                {mostrarDica ? 'Ocultar Dica' : 'Ver Dica'}
              </button>
            )}

            {mostrarDica && !foiRespondida && (
              <div className="p-2.5 bg-amber-50 border border-amber-300 text-xs text-amber-900 mt-2">
                {desafioAtual.dica}
              </div>
            )}
          </div>

          {foiRespondida && (
            <button
              onClick={proximoDesafio}
              className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
            >
              Próxima Questão
            </button>
          )}
        </div>

        {foiRespondida && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1">
            <div className="font-bold text-blue-900">Explicação Teórica:</div>
            <p className="leading-relaxed">{desafioAtual.explicacaoCompleta}</p>
          </div>
        )}
      </div>
    </div>
  )
}
