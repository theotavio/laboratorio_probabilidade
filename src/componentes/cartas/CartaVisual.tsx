import React from 'react'
import type { Carta, NaipeCarta } from '../../tipos/probabilidade'

interface PropriedadesCartaVisual {
  carta: Carta
  viradaParaCima?: boolean
  tamanho?: 'pequeno' | 'medio' | 'grande'
  destaque?: boolean
}

export const CartaVisual: React.FC<PropriedadesCartaVisual> = ({
  carta,
  viradaParaCima = true,
  tamanho = 'medio',
  destaque = false,
}) => {
  const obterSimboloNaipe = (naipe: NaipeCarta) => {
    switch (naipe) {
      case 'copas':
        return '♥'
      case 'ouros':
        return '♦'
      case 'espadas':
        return '♠'
      case 'paus':
        return '♣'
    }
  }

  const dimensoes = {
    pequeno: 'w-10 h-14 text-xs',
    medio: 'w-16 h-24 text-xs sm:text-sm',
    grande: 'w-24 h-36 text-sm sm:text-base',
  }

  const simbolo = obterSimboloNaipe(carta.naipe)
  const ehVermelha = carta.cor === 'vermelha'
  const corTexto = ehVermelha ? 'text-red-600' : 'text-gray-900'

  return (
    <div
      className={`relative select-none transition-all ${dimensoes[tamanho]} ${
        destaque ? 'ring-2 ring-blue-600 shadow-md' : 'shadow-xs'
      }`}
      style={{ perspective: 800 }}
    >
      <div
        className={`w-full h-full relative transition-transform duration-500 ${
          viradaParaCima ? '' : '[transform:rotateY(180deg)]'
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className={`absolute inset-0 w-full h-full bg-white border border-gray-400 p-1 flex flex-col justify-between [backface-visibility:hidden] ${corTexto}`}
        >
          <div className="flex flex-col items-start leading-none font-bold">
            <span>{carta.valor}</span>
            <span className="text-[10px]">{simbolo}</span>
          </div>

          <div className="flex items-center justify-center text-xl font-bold">
            {simbolo}
          </div>

          <div className="flex flex-col items-end leading-none font-bold rotate-180">
            <span>{carta.valor}</span>
            <span className="text-[10px]">{simbolo}</span>
          </div>
        </div>

        <div
          className="absolute inset-0 w-full h-full bg-blue-900 border border-blue-950 p-1 flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <div className="w-full h-full border border-blue-300/40 flex items-center justify-center bg-blue-950/40">
            <span className="text-white/60 font-mono text-[9px] font-bold">BARALHO</span>
          </div>
        </div>
      </div>
    </div>
  )
}
