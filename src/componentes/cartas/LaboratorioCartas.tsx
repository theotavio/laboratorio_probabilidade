import React, { useState, useMemo } from 'react'
import { MesaCartas } from './MesaCartas'
import { ControleEventosCartas, EVENTOS_DISPONIVEIS } from './ControleEventosCartas'
import { ExplicacaoPorQueCartas } from './ExplicacaoPorQueCartas'
import { GraficoBarrasComparativo, type ItemComparativoGrafico } from '../comuns/GraficoBarrasComparativo'
import type { Carta } from '../../tipos/probabilidade'
import { criarBaralhoPadrao, embaralharLista } from '../../utilitarios/calculosProbabilidade'
import { usarEstatisticas } from '../../contextos/ContextoEstatisticas'

export const LaboratorioCartas: React.FC = () => {
  const [baralho, setBaralho] = useState<Carta[]>(() => embaralharLista(criarBaralhoPadrao()))
  const [cartasNaMesa, setCartasNaMesa] = useState<Carta[]>([])
  const [cartasViradas, setCartasViradas] = useState(false)
  const [estaEmbaralhando, setEstaEmbaralhando] = useState(false)
  const [eventoSelecionadoId, setEventoSelecionadoId] = useState<string>('as')
  const [comReposicao, setComReposicao] = useState(true)
  const [quantidadePorTirada, setQuantidadePorTirada] = useState(1)

  const [totalTiradas, setTotalTiradas] = useState(0)
  const [totalSucessos, setTotalSucessos] = useState(0)

  const { registrarCartasRetiradas } = usarEstatisticas()

  const eventoAtual = useMemo(() => {
    return EVENTOS_DISPONIVEIS.find((e) => e.id === eventoSelecionadoId) || EVENTOS_DISPONIVEIS[0]
  }, [eventoSelecionadoId])

  const baralhoCompleto = useMemo(() => criarBaralhoPadrao(), [])

  const cartasFavoraveis = useMemo(() => {
    return baralhoCompleto.filter(eventoAtual.filtro)
  }, [baralhoCompleto, eventoAtual])

  const embaralhar = () => {
    setEstaEmbaralhando(true)
    setTimeout(() => {
      setBaralho(embaralharLista(comReposicao ? criarBaralhoPadrao() : baralho))
      setEstaEmbaralhando(false)
    }, 300)
  }

  const resetarBaralho = () => {
    setBaralho(embaralharLista(criarBaralhoPadrao()))
    setCartasNaMesa([])
    setCartasViradas(false)
  }

  const puxarCartas = () => {
    let fonte = [...baralho]
    if (comReposicao) {
      fonte = embaralharLista(criarBaralhoPadrao())
    }

    if (fonte.length < quantidadePorTirada) {
      fonte = embaralharLista(criarBaralhoPadrao())
    }

    const cartasPuxadas = fonte.slice(0, quantidadePorTirada)
    const restantes = fonte.slice(quantidadePorTirada)

    if (!comReposicao) {
      setBaralho(restantes)
    }

    setCartasNaMesa(cartasPuxadas)
    setCartasViradas(false)

    setTimeout(() => {
      setCartasViradas(true)
      const houveSucesso = cartasPuxadas.some(eventoAtual.filtro)
      setTotalTiradas((ant) => ant + 1)
      if (houveSucesso) {
        setTotalSucessos((ant) => ant + 1)
      }
      registrarCartasRetiradas(quantidadePorTirada)
    }, 250)
  }

  const simularLote = (quantidade: number) => {
    let sucessos = 0
    for (let i = 0; i < quantidade; i++) {
      const indice = Math.floor(Math.random() * 52)
      const carta = baralhoCompleto[indice]
      if (eventoAtual.filtro(carta)) {
        sucessos++
      }
    }

    setTotalTiradas((ant) => ant + quantidade)
    setTotalSucessos((ant) => ant + sucessos)
    registrarCartasRetiradas(quantidade)
  }

  const limparHistorico = () => {
    setTotalTiradas(0)
    setTotalSucessos(0)
  }

  const probabilidadeTeoricaSucesso = cartasFavoraveis.length / 52
  const probabilidadeTeoricaFracasso = 1 - probabilidadeTeoricaSucesso

  const freqExperimentalSucesso = totalTiradas > 0 ? totalSucessos / totalTiradas : 0
  const freqExperimentalFracasso = totalTiradas > 0 ? (totalTiradas - totalSucessos) / totalTiradas : 0

  const itensGrafico: ItemComparativoGrafico[] = [
    {
      chave: 'sucesso',
      rotulo: 'Evento Ocorreu',
      probabilidadeTeorica: probabilidadeTeoricaSucesso,
      frequenciaExperimental: freqExperimentalSucesso,
      quantidadeOcorrencias: totalSucessos,
      destaque: true,
    },
    {
      chave: 'fracasso',
      rotulo: 'Não Ocorreu',
      probabilidadeTeorica: probabilidadeTeoricaFracasso,
      frequenciaExperimental: freqExperimentalFracasso,
      quantidadeOcorrencias: totalTiradas - totalSucessos,
      destaque: false,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 border border-gray-300">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Laboratório de Cartas</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Analise eventos no baralho de 52 cartas e teste a diferença entre retiradas com e sem reposição.
          </p>
        </div>

        {totalTiradas > 0 && (
          <button
            onClick={limparHistorico}
            className="px-2.5 py-1 text-xs font-medium border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
          >
            Limpar ({totalTiradas})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 space-y-4">
          <MesaCartas
            baralhoRestante={comReposicao ? baralhoCompleto : baralho}
            cartasNaMesa={cartasNaMesa}
            cartasViradas={cartasViradas}
            estaEmbaralhando={estaEmbaralhando}
            eventoAtual={eventoAtual}
            aoEmbaralhar={embaralhar}
            aoPuxarCartas={puxarCartas}
            aoSimularLote={simularLote}
            aoResetarBaralho={resetarBaralho}
            totalRestante={comReposicao ? 52 : baralho.length}
            comReposicao={comReposicao}
          />

          <GraficoBarrasComparativo
            itens={itensGrafico}
            totalExperimentos={totalTiradas}
            rotuloEixoX={`Resultado do evento "${eventoAtual.titulo}"`}
          />
        </div>

        <div className="lg:col-span-5 space-y-4">
          <ControleEventosCartas
            eventoSelecionadoId={eventoSelecionadoId}
            aoSelecionarEvento={setEventoSelecionadoId}
            comReposicao={comReposicao}
            aoMudarReposicao={setComReposicao}
            quantidadePorTirada={quantidadePorTirada}
            aoMudarQuantidade={setQuantidadePorTirada}
          />

          <ExplicacaoPorQueCartas
            evento={eventoAtual}
            totalCasosFavoraveis={cartasFavoraveis.length}
            totalCartasBaralho={52}
            comReposicao={comReposicao}
            totalTiradas={totalTiradas}
            totalSucessos={totalSucessos}
          />
        </div>
      </div>
    </div>
  )
}
