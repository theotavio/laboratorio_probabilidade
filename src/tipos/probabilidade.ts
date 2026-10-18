export type AbaNavegacao = 'dados' | 'roletas' | 'cartas' | 'desafios' | 'estatisticas'

export interface DadoFisico {
  id: string
  valor: number
  x: number
  y: number
  velocidadeX: number
  velocidadeY: number
  angulo: number
  velocidadeAngular: number
  emMovimento: boolean
}

export interface LancamentoDados {
  id: string
  valores: number[]
  soma: number
  momento: Date
}

export interface DistribuicaoTeoricaSoma {
  soma: number
  combinacoes: [number, number][]
  quantidadeCombinacoes: number
  probabilidadeTeorica: number
}

export interface SetorRoleta {
  id: string
  nome: string
  cor: string
  peso: number
  probabilidadeTeorica: number
  anguloInicio?: number
  anguloFim?: number
}

export interface GiroRoleta {
  id: string
  setorId: string
  nomeSetor: string
  cor: string
  momento: Date
}

export type NaipeCarta = 'copas' | 'ouros' | 'espadas' | 'paus'
export type CorCarta = 'vermelha' | 'preta'
export type ValorCarta = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export interface Carta {
  id: string
  naipe: NaipeCarta
  valor: ValorCarta
  cor: CorCarta
  valorNumerico: number
  ehFigura: boolean
}

export interface EventoCarta {
  id: string
  titulo: string
  descricao: string
  filtro: (carta: Carta) => boolean
}

export interface ResultadoTirada {
  id: string
  cartas: Carta[]
  sucessosEvento: number
  eventoId: string
  comReposicao: boolean
  momento: Date
}

export interface OpcaoDesafio {
  id: string
  texto: string
  estaCorreta: boolean
  justificativa: string
}

export interface DesafioProbabilidade {
  id: string
  modulo: 'dados' | 'roletas' | 'cartas' | 'geral'
  dificuldade: 'facil' | 'medio' | 'desafiador'
  pergunta: string
  contexto: string
  opcoes: OpcaoDesafio[]
  dica: string
  explicacaoCompleta: string
}

export interface EstatisticasGerais {
  totalLancamentosDados: number
  historicoSomasDados: Record<number, number>
  totalGirosRoleta: number
  historicoSetoresRoleta: Record<string, number>
  totalCartasRetiradas: number
  totalAcertosDesafios: number
  totalDesafiosRespondidos: number
  desafiosConcluidos: string[]
}
