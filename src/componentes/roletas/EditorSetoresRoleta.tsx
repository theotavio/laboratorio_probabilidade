import React, { useState } from 'react'
import type { SetorRoleta } from '../../tipos/probabilidade'

interface PropriedadesEditorSetoresRoleta {
  setores: SetorRoleta[]
  aoAtualizarSetores: (novosSetores: SetorRoleta[]) => void
  desabilitado?: boolean
}

const PALETA_CORES = [
  '#dc2626',
  '#2563eb',
  '#16a34a',
  '#d97706',
  '#7c3aed',
  '#0891b2',
  '#475569',
  '#db2777',
]

export const EditorSetoresRoleta: React.FC<PropriedadesEditorSetoresRoleta> = ({
  setores,
  aoAtualizarSetores,
  desabilitado = false,
}) => {
  const [novoNome, setNovoNome] = useState('')
  const [novaCor, setNovaCor] = useState(PALETA_CORES[0])

  const alterarPeso = (id: string, delta: number) => {
    const atualizados = setores.map((s) => {
      if (s.id === id) {
        const novoPeso = Math.max(1, s.peso + delta)
        return { ...s, peso: novoPeso }
      }
      return s
    })
    aoAtualizarSetores(atualizados)
  }

  const removerSetor = (id: string) => {
    if (setores.length <= 2) return
    const atualizados = setores.filter((s) => s.id !== id)
    aoAtualizarSetores(atualizados)
  }

  const adicionarSetor = (e: React.FormEvent) => {
    e.preventDefault()
    if (!novoNome.trim()) return

    const novo: SetorRoleta = {
      id: `setor-${Date.now()}`,
      nome: novoNome.trim(),
      cor: novaCor,
      peso: 1,
      probabilidadeTeorica: 0,
    }

    aoAtualizarSetores([...setores, novo])
    setNovoNome('')
    const proximaCor = PALETA_CORES[(setores.length + 1) % PALETA_CORES.length]
    setNovaCor(proximaCor)
  }

  const aplicarModelo = (tipo: 'justa' | 'viciada' | 'sorte' | 'parImpar') => {
    if (tipo === 'justa') {
      aoAtualizarSetores([
        { id: '1', nome: 'Vermelho', cor: '#dc2626', peso: 1, probabilidadeTeorica: 0.25 },
        { id: '2', nome: 'Azul', cor: '#2563eb', peso: 1, probabilidadeTeorica: 0.25 },
        { id: '3', nome: 'Verde', cor: '#16a34a', peso: 1, probabilidadeTeorica: 0.25 },
        { id: '4', nome: 'Amarelo', cor: '#d97706', peso: 1, probabilidadeTeorica: 0.25 },
      ])
    } else if (tipo === 'viciada') {
      aoAtualizarSetores([
        { id: '1', nome: 'Mais Provável', cor: '#dc2626', peso: 8, probabilidadeTeorica: 0.8 },
        { id: '2', nome: 'Menos Provável', cor: '#2563eb', peso: 2, probabilidadeTeorica: 0.2 },
      ])
    } else if (tipo === 'sorte') {
      aoAtualizarSetores([
        { id: '1', nome: 'Prêmio Principal', cor: '#d97706', peso: 1, probabilidadeTeorica: 0.05 },
        { id: '2', nome: 'Segundo Lugar', cor: '#475569', peso: 3, probabilidadeTeorica: 0.15 },
        { id: '3', nome: 'Terceiro Lugar', cor: '#7c3aed', peso: 6, probabilidadeTeorica: 0.3 },
        { id: '4', nome: 'Sem Prêmio', cor: '#94a3b8', peso: 10, probabilidadeTeorica: 0.5 },
      ])
    } else if (tipo === 'parImpar') {
      aoAtualizarSetores([
        { id: '1', nome: 'Par', cor: '#2563eb', peso: 1, probabilidadeTeorica: 0.5 },
        { id: '2', nome: 'Ímpar', cor: '#dc2626', peso: 1, probabilidadeTeorica: 0.5 },
      ])
    }
  }

  const pesoTotal = setores.reduce((acc, s) => acc + Math.max(0, s.peso), 0)

  return (
    <div className="bg-white p-4 border border-gray-300 space-y-3">
      <div className="border-b border-gray-200 pb-2">
        <h4 className="text-sm font-bold text-gray-900">Configurar Setores da Roleta</h4>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs text-gray-500 self-center mr-1">Modelos:</span>
        <button
          type="button"
          onClick={() => aplicarModelo('justa')}
          disabled={desabilitado}
          className="px-2 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 cursor-pointer disabled:opacity-50"
        >
          Justa (4 Cores)
        </button>
        <button
          type="button"
          onClick={() => aplicarModelo('viciada')}
          disabled={desabilitado}
          className="px-2 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 cursor-pointer disabled:opacity-50"
        >
          Desbalanceada (80/20)
        </button>
        <button
          type="button"
          onClick={() => aplicarModelo('sorte')}
          disabled={desabilitado}
          className="px-2 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 cursor-pointer disabled:opacity-50"
        >
          Prêmios Raros
        </button>
        <button
          type="button"
          onClick={() => aplicarModelo('parImpar')}
          disabled={desabilitado}
          className="px-2 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 cursor-pointer disabled:opacity-50"
        >
          Par / Ímpar
        </button>
      </div>

      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
        {setores.map((setor) => {
          const porcentagem = pesoTotal > 0 ? (setor.peso / pesoTotal) * 100 : 0
          const anguloGraus = pesoTotal > 0 ? (setor.peso / pesoTotal) * 360 : 0

          return (
            <div
              key={setor.id}
              className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3.5 h-3.5 flex-shrink-0 border border-gray-400"
                  style={{ backgroundColor: setor.cor }}
                />
                <div className="truncate">
                  <div className="text-xs font-semibold text-gray-900 truncate">{setor.nome}</div>
                  <div className="text-[10px] text-gray-500 font-mono">
                    {porcentagem.toFixed(1)}% ({anguloGraus.toFixed(0)}°)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => alterarPeso(setor.id, -1)}
                  disabled={desabilitado || setor.peso <= 1}
                  className="w-5 h-5 bg-white hover:bg-gray-200 border border-gray-300 text-gray-800 flex items-center justify-center text-xs font-bold disabled:opacity-30 cursor-pointer"
                  title="Diminuir proporção"
                >
                  -
                </button>
                <span className="text-xs font-mono font-bold w-5 text-center text-gray-900">
                  {setor.peso}
                </span>
                <button
                  type="button"
                  onClick={() => alterarPeso(setor.id, 1)}
                  disabled={desabilitado}
                  className="w-5 h-5 bg-white hover:bg-gray-200 border border-gray-300 text-gray-800 flex items-center justify-center text-xs font-bold cursor-pointer"
                  title="Aumentar proporção"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => removerSetor(setor.id)}
                  disabled={desabilitado || setores.length <= 2}
                  className="px-1.5 h-5 bg-white hover:bg-red-50 border border-gray-300 text-red-600 flex items-center justify-center text-[10px] disabled:opacity-20 cursor-pointer ml-1"
                  title="Remover"
                >
                  Excluir
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <form onSubmit={adicionarSetor} className="flex gap-2 pt-2 border-t border-gray-200">
        <input
          type="text"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          placeholder="Nome do novo setor..."
          disabled={desabilitado}
          className="flex-1 px-2.5 py-1 text-xs border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-600"
        />
        <input
          type="color"
          value={novaCor}
          onChange={(e) => setNovaCor(e.target.value)}
          disabled={desabilitado}
          className="w-7 h-7 p-0 cursor-pointer border border-gray-300"
        />
        <button
          type="submit"
          disabled={desabilitado || !novoNome.trim()}
          className="px-3 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 cursor-pointer"
        >
          Adicionar
        </button>
      </form>
    </div>
  )
}
