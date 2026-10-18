import React from 'react'

interface PropriedadesCartaoExplicativo {
  titulo: string
  subtitulo?: string
  children: React.ReactNode
}

export const CartaoExplicativo: React.FC<PropriedadesCartaoExplicativo> = ({
  titulo,
  subtitulo,
  children,
}) => {
  return (
    <div className="border border-gray-300 bg-white p-4 shadow-xs">
      <div className="mb-3 border-b border-gray-200 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <h3 className="text-sm sm:text-base font-bold text-gray-900">{titulo}</h3>
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200">
            Explicação
          </span>
        </div>
        {subtitulo && <p className="text-xs text-gray-500 mt-0.5">{subtitulo}</p>}
      </div>
      <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  )
}
