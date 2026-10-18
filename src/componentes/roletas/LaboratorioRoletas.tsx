import React, { useState, useMemo } from 'react'
import { RoletaCanvas } from './RoletaCanvas'
import { EditorSetoresRoleta } from './EditorSetoresRoleta'
import { ExplicacaoPorQueRoleta } from './ExplicacaoPorQueRoleta'
import { GraficoBarrasComparativo, type ItemComparativoGrafico } from '../comuns/GraficoBarrasComparativo'
import type { SetorRoleta } from '../../tipos/probabilidade'
import { calcularAngulosSetores } from '../../utilitarios/calculosProbabilidade'
import { usarEstatisticas } from '../../contextos/ContextoEstatisticas'

const SETORES_INICIAIS: SetorRoleta[] = [
  { id: '1', nome: 'Vermelho', cor: '#dc2626', peso: 1, probabilidadeTeorica: 0.25 },
  { id: '2', nome: 'Azul', cor: '#2563eb', peso: 1, probabilidadeTeorica: 0.25 },
  { id: '3', nome: 'Verde', cor: '#16a34a', peso: 1, probabilidadeTeorica: 0.25 },
  { id: '4', nome: 'Amarelo', cor: '#d97706', peso: 1, probabilidadeTeorica: 0.25 },
]

export const LaboratorioRoletas: React.FC = () => {
  const [setoresBrutos, setSetoresBrutos] = useState<SetorRoleta[]>(SETORES_INICIAIS)
  const [estaGirando, setEstaGirando] = useState(false)
  const [historicoGiros, setHistoricoGiros] = useState<Record<string, number>>({})
  const [totalGiros, setTotalGiros] = useState(0)
  const [setorSelecionado, setSetorSelecionado] = useState<string | null>(null)

  const { registrarGiroRoleta } = usarEstatisticas()

  const setoresCalculados = useMemo(() => {
    return calcularAngulosSetores(setoresBrutos)
  }, [setoresBrutos])

  const lidarComFinalizacaoGiro = (setorSorteado: SetorRoleta) => {
    setEstaGirando(false)
    setHistoricoGiros((anterior) => ({
      ...anterior,
      [setorSorteado.id]: (anterior[setorSorteado.id] || 0) + 1,
    }))
    setTotalGiros((anterior) => anterior + 1)
    setSetorSelecionado(setorSorteado.id)
    registrarGiroRoleta(setorSorteado.id)
  }

  const simularGirosEmLote = (quantidade: number) => {
    if (estaGirando || setoresCalculados.length === 0) return
    const novosGiros = { ...historicoGiros }
    const pesoTotal = setoresCalculados.reduce((acc, s) => acc + Math.max(0, s.peso), 0)
    let ultimoId = setoresCalculados[0].id

    for (let i = 0; i < quantidade; i++) {
      let aleatorio = Math.random() * pesoTotal
      let escolhido = setoresCalculados[0]

      for (const setor of setoresCalculados) {
        if (aleatorio <= setor.peso) {
          escolhido = setor
          break
        }
        aleatorio -= setor.peso
      }

      novosGiros[escolhido.id] = (novosGiros[escolhido.id] || 0) + 1
      registrarGiroRoleta(escolhido.id)
      ultimoId = escolhido.id
    }

    setHistoricoGiros(novosGiros)
    setTotalGiros((anterior) => anterior + quantidade)
    setSetorSelecionado(ultimoId)
  }

  const limparHistorico = () => {
    setHistoricoGiros({})
    setTotalGiros(0)
    setSetorSelecionado(null)
  }

  const itensGrafico: ItemComparativoGrafico[] = setoresCalculados.map((setor) => {
    const ocorrencias = historicoGiros[setor.id] || 0
    const experimental = totalGiros > 0 ? ocorrencias / totalGiros : 0

    return {
      chave: setor.id,
      rotulo: setor.nome,
      probabilidadeTeorica: setor.probabilidadeTeorica,
      frequenciaExperimental: experimental,
      quantidadeOcorrencias: ocorrencias,
      destaque: setorSelecionado === setor.id,
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 border border-gray-300">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Laboratório de Roletas</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Personalize os setores e observe como a área circular determina as chances de parada.
          </p>
        </div>

        {totalGiros > 0 && (
          <button
            onClick={limparHistorico}
            disabled={estaGirando}
            className="px-2.5 py-1 text-xs font-medium border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            Limpar ({totalGiros})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-6 space-y-4">
          <RoletaCanvas
            setores={setoresCalculados}
            estaGirando={estaGirando}
            aoIniciarGiro={() => setEstaGirando(true)}
            aoFinalizarGiro={lidarComFinalizacaoGiro}
            aoSimularGirosEmLote={simularGirosEmLote}
          />

          <GraficoBarrasComparativo
            itens={itensGrafico}
            totalExperimentos={totalGiros}
            itemSelecionado={setorSelecionado}
            aoSelecionarItem={(chave) => setSetorSelecionado(String(chave))}
            rotuloEixoX="Setores configurados na roleta"
          />
        </div>

        <div className="lg:col-span-6 space-y-4">
          <EditorSetoresRoleta
            setores={setoresCalculados}
            aoAtualizarSetores={setSetoresBrutos}
            desabilitado={estaGirando}
          />

          <ExplicacaoPorQueRoleta
            setores={setoresCalculados}
            totalGiros={totalGiros}
            historicoGiros={historicoGiros}
          />
        </div>
      </div>
    </div>
  )
}
