import type { Carta, NaipeCarta, ValorCarta, DistribuicaoTeoricaSoma, SetorRoleta } from '../tipos/probabilidade'

export function calcularMaximoDivisorComum(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y) {
    const t = y
    y = x % y
    x = t
  }
  return x
}

export function formatarFracao(numerador: number, denominador: number): string {
  if (denominador === 0) return '0'
  if (numerador === 0) return '0'
  const mdc = calcularMaximoDivisorComum(numerador, denominador)
  const numSimplificado = numerador / mdc
  const denSimplificado = denominador / mdc
  if (denSimplificado === 1) return `${numSimplificado}`
  return `${numSimplificado}/${denSimplificado}`
}

export function formatarPorcentagem(probabilidadeDecimal: number): string {
  return `${(probabilidadeDecimal * 100).toFixed(1)}%`
}

export function obterCombinacoesDoisDados(): Record<number, [number, number][]> {
  const mapaCombinacoes: Record<number, [number, number][]> = {}
  for (let soma = 2; soma <= 12; soma++) {
    mapaCombinacoes[soma] = []
  }

  for (let dado1 = 1; dado1 <= 6; dado1++) {
    for (let dado2 = 1; dado2 <= 6; dado2++) {
      const soma = dado1 + dado2
      mapaCombinacoes[soma].push([dado1, dado2])
    }
  }

  return mapaCombinacoes
}

export function obterDistribuicoesTeoricasDados(quantidadeDados: number): DistribuicaoTeoricaSoma[] {
  if (quantidadeDados === 1) {
    const distribuicoes: DistribuicaoTeoricaSoma[] = []
    for (let valor = 1; valor <= 6; valor++) {
      distribuicoes.push({
        soma: valor,
        combinacoes: [[valor, 0]],
        quantidadeCombinacoes: 1,
        probabilidadeTeorica: 1 / 6,
      })
    }
    return distribuicoes
  }

  if (quantidadeDados === 2) {
    const mapaCombinacoes = obterCombinacoesDoisDados()
    const totalPossibilidades = 36
    const distribuicoes: DistribuicaoTeoricaSoma[] = []

    for (let soma = 2; soma <= 12; soma++) {
      const combinacoes = mapaCombinacoes[soma]
      distribuicoes.push({
        soma,
        combinacoes,
        quantidadeCombinacoes: combinacoes.length,
        probabilidadeTeorica: combinacoes.length / totalPossibilidades,
      })
    }
    return distribuicoes
  }

  const mapaContagem: Record<number, number> = {}
  const totalPossibilidades = Math.pow(6, quantidadeDados)

  function contarRecursivo(dadosRestantes: number, somaAcumulada: number) {
    if (dadosRestantes === 0) {
      mapaContagem[somaAcumulada] = (mapaContagem[somaAcumulada] || 0) + 1
      return
    }
    for (let face = 1; face <= 6; face++) {
      contarRecursivo(dadosRestantes - 1, somaAcumulada + face)
    }
  }

  contarRecursivo(quantidadeDados, 0)

  const minSoma = quantidadeDados
  const maxSoma = quantidadeDados * 6
  const distribuicoes: DistribuicaoTeoricaSoma[] = []

  for (let soma = minSoma; soma <= maxSoma; soma++) {
    const qtd = mapaContagem[soma] || 0
    distribuicoes.push({
      soma,
      combinacoes: [],
      quantidadeCombinacoes: qtd,
      probabilidadeTeorica: qtd / totalPossibilidades,
    })
  }

  return distribuicoes
}

export function calcularAngulosSetores(setores: SetorRoleta[]): SetorRoleta[] {
  const pesoTotal = setores.reduce((acumulado, setor) => acumulado + Math.max(0, setor.peso), 0)
  if (pesoTotal === 0) return setores

  let anguloAtual = 0
  return setores.map((setor) => {
    const proporcao = Math.max(0, setor.peso) / pesoTotal
    const anguloArco = proporcao * 2 * Math.PI
    const anguloInicio = anguloAtual
    const anguloFim = anguloAtual + anguloArco
    anguloAtual = anguloFim

    return {
      ...setor,
      probabilidadeTeorica: proporcao,
      anguloInicio,
      anguloFim,
    }
  })
}

export function criarBaralhoPadrao(): Carta[] {
  const naipes: NaipeCarta[] = ['copas', 'ouros', 'espadas', 'paus']
  const valores: ValorCarta[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const baralho: Carta[] = []

  for (const naipe of naipes) {
    const cor = naipe === 'copas' || naipe === 'ouros' ? 'vermelha' : 'preta'

    for (const valor of valores) {
      let valorNumerico = 0
      if (valor === 'A') valorNumerico = 1
      else if (valor === 'J') valorNumerico = 11
      else if (valor === 'Q') valorNumerico = 12
      else if (valor === 'K') valorNumerico = 13
      else valorNumerico = parseInt(valor, 10)

      const ehFigura = valor === 'J' || valor === 'Q' || valor === 'K'

      baralho.push({
        id: `${valor}-${naipe}`,
        naipe,
        valor,
        cor,
        valorNumerico,
        ehFigura,
      })
    }
  }

  return baralho
}

export function sortearNumeroInteiro(minimo: number, maximo: number): number {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo
}

export function embaralharLista<T>(lista: T[]): T[] {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temporario = copia[i]
    copia[i] = copia[j]
    copia[j] = temporario
  }
  return copia
}
