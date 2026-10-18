import React, { createContext, useContext, useState, useEffect } from 'react'
import type { EstatisticasGerais } from '../tipos/probabilidade'

interface TipoContextoEstatisticas {
  estatisticas: EstatisticasGerais
  registrarLancamentoDados: (soma: number) => void
  registrarGiroRoleta: (setorId: string) => void
  registrarCartasRetiradas: (quantidade: number) => void
  registrarRespostaDesafio: (idDesafio: string, acertou: boolean) => void
  reiniciarTodasEstatisticas: () => void
}

const estadoInicial: EstatisticasGerais = {
  totalLancamentosDados: 0,
  historicoSomasDados: {},
  totalGirosRoleta: 0,
  historicoSetoresRoleta: {},
  totalCartasRetiradas: 0,
  totalAcertosDesafios: 0,
  totalDesafiosRespondidos: 0,
  desafiosConcluidos: [],
}

const ContextoEstatisticas = createContext<TipoContextoEstatisticas | undefined>(undefined)

export const ProvedorEstatisticas: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [estatisticas, setEstatisticas] = useState<EstatisticasGerais>(() => {
    try {
      const salvo = localStorage.getItem('estatisticas_probabilidade')
      return salvo ? JSON.parse(salvo) : estadoInicial
    } catch {
      return estadoInicial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('estatisticas_probabilidade', JSON.stringify(estatisticas))
    } catch {
      return
    }
  }, [estatisticas])

  const registrarLancamentoDados = (soma: number) => {
    setEstatisticas((anterior) => {
      const historicoAtualizado = { ...anterior.historicoSomasDados }
      historicoAtualizado[soma] = (historicoAtualizado[soma] || 0) + 1
      return {
        ...anterior,
        totalLancamentosDados: anterior.totalLancamentosDados + 1,
        historicoSomasDados: historicoAtualizado,
      }
    })
  }

  const registrarGiroRoleta = (setorId: string) => {
    setEstatisticas((anterior) => {
      const historicoAtualizado = { ...anterior.historicoSetoresRoleta }
      historicoAtualizado[setorId] = (historicoAtualizado[setorId] || 0) + 1
      return {
        ...anterior,
        totalGirosRoleta: anterior.totalGirosRoleta + 1,
        historicoSetoresRoleta: historicoAtualizado,
      }
    })
  }

  const registrarCartasRetiradas = (quantidade: number) => {
    setEstatisticas((anterior) => ({
      ...anterior,
      totalCartasRetiradas: anterior.totalCartasRetiradas + quantidade,
    }))
  }

  const registrarRespostaDesafio = (idDesafio: string, acertou: boolean) => {
    setEstatisticas((anterior) => {
      const jaConcluido = anterior.desafiosConcluidos.includes(idDesafio)
      const listaAtualizada = jaConcluido ? anterior.desafiosConcluidos : [...anterior.desafiosConcluidos, idDesafio]
      return {
        ...anterior,
        totalDesafiosRespondidos: anterior.totalDesafiosRespondidos + 1,
        totalAcertosDesafios: acertou ? anterior.totalAcertosDesafios + 1 : anterior.totalAcertosDesafios,
        desafiosConcluidos: listaAtualizada,
      }
    })
  }

  const reiniciarTodasEstatisticas = () => {
    setEstatisticas(estadoInicial)
  }

  return (
    <ContextoEstatisticas.Provider
      value={{
        estatisticas,
        registrarLancamentoDados,
        registrarGiroRoleta,
        registrarCartasRetiradas,
        registrarRespostaDesafio,
        reiniciarTodasEstatisticas,
      }}
    >
      {children}
    </ContextoEstatisticas.Provider>
  )
}

export function usarEstatisticas(): TipoContextoEstatisticas {
  const contexto = useContext(ContextoEstatisticas)
  if (!contexto) {
    throw new Error('usarEstatisticas deve ser usado dentro de ProvedorEstatisticas')
  }
  return contexto
}
