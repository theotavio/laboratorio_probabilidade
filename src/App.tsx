import { useState } from 'react'
import { BarraNavegacao } from './componentes/comuns/BarraNavegacao'
import { LaboratorioDados } from './componentes/dados/LaboratorioDados'
import { LaboratorioRoletas } from './componentes/roletas/LaboratorioRoletas'
import { LaboratorioCartas } from './componentes/cartas/LaboratorioCartas'
import { AreaDesafios } from './componentes/desafios/AreaDesafios'
import { TelaEstatisticas } from './componentes/estatisticas/TelaEstatisticas'
import { ProvedorEstatisticas } from './contextos/ContextoEstatisticas'
import type { AbaNavegacao } from './tipos/probabilidade'

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState<AbaNavegacao>('dados')

  return (
    <ProvedorEstatisticas>
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
        <BarraNavegacao abaAtiva={abaAtiva} aoMudarAba={setAbaAtiva} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5">
          {abaAtiva === 'dados' && <LaboratorioDados />}
          {abaAtiva === 'roletas' && <LaboratorioRoletas />}
          {abaAtiva === 'cartas' && <LaboratorioCartas />}
          {abaAtiva === 'desafios' && <AreaDesafios />}
          {abaAtiva === 'estatisticas' && <TelaEstatisticas />}
        </main>

        <footer className="border-t border-gray-300 bg-white py-4 text-center text-xs text-gray-600">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <span className="font-semibold text-gray-700">Laboratório Interativo de Probabilidade</span>
          </div>
        </footer>
      </div>
    </ProvedorEstatisticas>
  )
}
