import React, { useState } from 'react'
import {
  Sun,
  Zap,
  TrendingUp,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Scale,
  Sparkles,
  ArrowRight,
  Info,
  Layers,
  FileSpreadsheet
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts'
import {
  UF_DATA,
  MESES_NOMES,
  TIPOS_ESTRUTURA,
  TIPOS_LIGACAO,
  MODULOS_PADRAO,
  REGRAS_TRANSICAO_FIO_B,
  PERFIS_SIMULTANEIDADE,
  formatCurrency,
  formatNumber
} from '../lib/solarData'
import { useSolarProject } from '../context/SolarProjectContext'

export default function DimensionamentoSolar({ onNavigate }) {
  const {
    cep, setCep,
    cidade, setCidade,
    uf, setUf,
    concessionaria, setConcessionaria,
    hspCustom, setHspCustom,
    tarifaKwh, setTarifaKwh,
    setMensalHsp,
    consumoMensal, setConsumoMensal,
    tipoLigacao, setTipoLigacao,
    descontarDisponibilidade, setDescontarDisponibilidade,
    performanceRatio, setPerformanceRatio,
    tipoEstrutura, setTipoEstrutura,
    moduloSelecionadoId, setModuloSelecionadoId,
    setPotenciaModuloCustom,
    qtdModulosManual, setQtdModulosManual,
    dadosDimensionamento,
    simultaneidade, setSimultaneidade,
    tarifaFioBIntegral, setTarifaFioBIntegral,
    anoTransicaoFioB, setAnoTransicaoFioB,
    calculoFioB,
    sincronizarModulosComDimensionamento
  } = useSolarProject()

  const [loadingCep, setLoadingCep] = useState(false)
  const [cepError, setCepError] = useState('')

  // Busca de CEP
  const handleBuscarCep = async () => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) {
      setCepError('Digite um CEP válido com 8 dígitos')
      return
    }
    setLoadingCep(true)
    setCepError('')

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await res.json()
      if (data.erro) {
        setCepError('CEP não encontrado na base dos Correios.')
        return
      }

      const ufEncontrada = data.uf.toUpperCase()
      setCidade(data.localidade)
      setUf(ufEncontrada)

      if (UF_DATA[ufEncontrada]) {
        const infoUf = UF_DATA[ufEncontrada]
        setConcessionaria(infoUf.concessionaria)
        setHspCustom(infoUf.irradiacaoMedia)
        setTarifaKwh(infoUf.tarifa)
        setMensalHsp(infoUf.mensal)
        setTarifaFioBIntegral(Number((infoUf.tarifa * 0.28).toFixed(4)))
      }
    } catch {
      setCepError('Erro ao consultar CEP. Tente novamente.')
    } finally {
      setLoadingCep(false)
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto pb-24 font-body text-[#F5F5F4]">
      
      {/* HEADER DA MARCA B2W ENERGIA */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#1E1C18] pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#EE4A22]/10 border border-[#EE4A22]/30 rounded-xl text-[#EE4A22] shadow-[0_4px_16px_rgba(238,74,34,0.2)]">
              <Sun size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#EE4A22] font-display">
                  B2W Energia · Engenharia
                </span>
                <span className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Lei 14.300
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-display">
                Dimensionamento de Potência Solar
              </h1>
            </div>
          </div>
          <p className="text-sm text-[#A8A49D] max-w-2xl">
            Calcule a capacidade necessária da usina com base no consumo do cliente e na irradiação solar da região. O Fio B incide somente sobre a energia injetada após a dedução da simultaneidade.
          </p>
        </div>

        {/* NAVEGAÇÃO ENTRE ÁREAS */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate?.('viabilidade')}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs md:text-sm bg-[#141310] hover:bg-[#1E1C18] border border-[#2E2B26] text-[#F5F5F4] flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <FileSpreadsheet size={16} className="text-[#10B981]" />
            <span>Viabilidade Financeira</span>
          </button>

          <button
            onClick={() => {
              sincronizarModulosComDimensionamento()
              onNavigate?.('custos')
            }}
            className="px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm bg-[#EE4A22] hover:bg-[#D33A15] text-white shadow-[0_4px_16px_rgba(238,74,34,0.28)] flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <span>Ir para Custos & Precificação</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* KPI HIGHLIGHT CARDS (B2W ENERGIA STYLE) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Potência Recomendada */}
        <div className="card-solar p-5 shadow-lg relative">
          <span className="text-[11px] uppercase font-bold tracking-wider text-[#A8A49D] flex items-center gap-1.5 font-display">
            <Sun size={14} className="text-[#EE4A22]" /> Potência Calculada
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-white font-display">
              {formatNumber(dadosDimensionamento.potenciaRealKwp, 2)}
            </span>
            <span className="text-sm font-bold text-[#EE4A22]">kWp</span>
          </div>
          <span className="text-xs text-[#A8A49D] mt-1 block">
            {dadosDimensionamento.qtdModulosReal}x painéis de {dadosDimensionamento.potenciaWpUnit}W
          </span>
        </div>

        {/* Geração Média */}
        <div className="card-solar p-5 shadow-lg relative">
          <span className="text-[11px] uppercase font-bold tracking-wider text-[#A8A49D] flex items-center gap-1.5 font-display">
            <Zap size={14} className="text-[#3B82F6]" /> Geração Mensal
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-white font-display">
              {Math.round(dadosDimensionamento.geracaoMensalMediaKwh)}
            </span>
            <span className="text-sm font-bold text-[#3B82F6]">kWh/mês</span>
          </div>
          <span className="text-xs text-[#10B981] mt-1 block font-semibold">
            Supre {Math.round((dadosDimensionamento.geracaoMensalMediaKwh / (consumoMensal || 1)) * 100)}% da demanda
          </span>
        </div>

        {/* Simultaneidade & Injeção */}
        <div className="card-solar p-5 shadow-lg relative">
          <span className="text-[11px] uppercase font-bold tracking-wider text-[#A8A49D] flex items-center gap-1.5 font-display">
            <Scale size={14} className="text-[#10B981]" /> Autoconsumo ({calculoFioB.pctSimult}%)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-white font-display">
              {Math.round(calculoFioB.energiaSimultaneaKwh)}
            </span>
            <span className="text-sm font-bold text-[#10B981]">kWh livre</span>
          </div>
          <span className="text-xs text-[#A8A49D] mt-1 block">
            {Math.round(calculoFioB.energiaInjetadaKwh)} kWh injetados na rede
          </span>
        </div>

        {/* Economia Líquida Real */}
        <div className="card-savings p-5 shadow-lg relative bg-[#10B981]/5 border border-[#10B981]/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#10B981] flex items-center gap-1.5 font-display">
              <TrendingUp size={14} /> Economia Líquida Real
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] font-bold">
              Pós-Fio B
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-[#10B981] font-display truncate">
              {formatCurrency(calculoFioB.economiaLiquidaMensal)}
            </span>
            <span className="text-xs text-[#10B981]/80 font-bold">/mês</span>
          </div>
          <span className="text-xs text-[#A8A49D] mt-1 block">
            ~{formatCurrency(calculoFioB.economiaLiquidaAnual)}/ano acumulado
          </span>
        </div>
      </div>

      {/* ÁREA PRINCIPAL: PARÂMETROS E RESULTADOS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA ESQUERDA: PARÂMETROS DE ENTRADA */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Demanda do Cliente */}
          <div className="bg-[#141310] border border-[#1E1C18] rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#1E1C18] pb-4">
              <h3 className="font-bold text-lg text-white flex items-center gap-2 font-display">
                <Zap className="text-[#EE4A22]" size={20} />
                Consumo & Demanda de Energia
              </h3>
              <span className="text-xs bg-[#1E1C18] text-[#A8A49D] px-3 py-1 rounded-full font-medium">
                Passo 1
              </span>
            </div>

            {/* Consumo Mensal com Slider e Stepper */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-[#A8A49D]">
                  Consumo Médio Mensal (kWh/mês)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="50"
                    max="20000"
                    step="10"
                    value={consumoMensal}
                    onChange={(e) => {
                      setConsumoMensal(Number(e.target.value) || 0)
                      setQtdModulosManual(null)
                    }}
                    className="w-28 text-right bg-[#0D0D0D] border border-[#2E2B26] focus:border-[#EE4A22] rounded-xl px-3 py-1.5 text-lg font-bold text-[#EE4A22] font-mono focus:outline-none"
                  />
                  <span className="text-xs font-semibold text-[#A8A49D]">kWh</span>
                </div>
              </div>

              {/* Slider fluído B2W Energia */}
              <input
                type="range"
                min="100"
                max="3000"
                step="25"
                value={consumoMensal}
                onChange={(e) => {
                  setConsumoMensal(Number(e.target.value))
                  setQtdModulosManual(null)
                }}
                className="w-full accent-[#EE4A22] h-2 bg-[#1E1C18] rounded-lg cursor-pointer"
              />

              {/* Quick Pills de consumo */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[250, 400, 650, 900, 1200, 1800, 2500].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setConsumoMensal(val)
                      setQtdModulosManual(null)
                    }}
                    className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                      consumoMensal === val
                        ? 'bg-[#EE4A22] text-white shadow-[0_2px_8px_rgba(238,74,34,0.3)]'
                        : 'bg-[#1E1C18] text-[#A8A49D] hover:text-white hover:bg-[#2E2B26]'
                    }`}
                  >
                    {val} kWh
                  </button>
                ))}
              </div>
            </div>

            {/* Tipo de Ligação & Custo de Disponibilidade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#A8A49D] block mb-2">
                  Tipo de Ligação na Rede
                </label>
                <select
                  value={tipoLigacao}
                  onChange={(e) => setTipoLigacao(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#2E2B26] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#EE4A22]"
                >
                  {TIPOS_LIGACAO.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#A8A49D] block mb-2">
                  Custo de Disponibilidade (Lei 14.300)
                </label>
                <div className="flex items-center gap-3 h-11 px-3 bg-[#0D0D0D] border border-[#2E2B26] rounded-xl">
                  <input
                    type="checkbox"
                    id="chkDisponibilidade"
                    checked={descontarDisponibilidade}
                    onChange={(e) => setDescontarDisponibilidade(e.target.checked)}
                    className="w-4 h-4 accent-[#EE4A22] rounded cursor-pointer"
                  />
                  <label htmlFor="chkDisponibilidade" className="text-xs text-[#F5F5F4] cursor-pointer">
                    Descontar {dadosDimensionamento.custoDisponibilidade} kWh (Taxa Mínima)
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Localização & Irradiância Solar */}
          <div className="bg-[#141310] border border-[#1E1C18] rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#1E1C18] pb-4">
              <h3 className="font-bold text-lg text-white flex items-center gap-2 font-display">
                <MapPin className="text-[#EE4A22]" size={20} />
                Localização & Irradiância Solar (HSP)
              </h3>
              <span className="text-xs text-[#EE4A22] font-bold bg-[#EE4A22]/10 px-3 py-1 rounded-full border border-[#EE4A22]/20">
                {uf} — {cidade}
              </span>
            </div>

            {/* Busca CEP */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#A8A49D]">
                CEP da Instalação
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: 01310-100"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  className="flex-1 bg-[#0D0D0D] border border-[#2E2B26] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#6E6A62] focus:outline-none focus:border-[#EE4A22] font-mono"
                />
                <button
                  type="button"
                  onClick={handleBuscarCep}
                  disabled={loadingCep}
                  className="px-5 py-2.5 bg-[#EE4A22] hover:bg-[#D33A15] disabled:bg-[#2E2B26] text-white font-bold rounded-xl text-sm transition-all shadow-[0_4px_16px_rgba(238,74,34,0.28)] active:scale-95 cursor-pointer"
                >
                  {loadingCep ? 'Buscando...' : 'Buscar CEP'}
                </button>
              </div>
              {cepError && <span className="text-xs text-red-400 block">{cepError}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Concessionária */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#A8A49D] block mb-1.5">
                  Concessionária
                </label>
                <input
                  type="text"
                  value={concessionaria}
                  onChange={(e) => setConcessionaria(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#2E2B26] rounded-xl px-3 py-2 text-xs text-[#F5F5F4] focus:outline-none focus:border-[#EE4A22]"
                />
              </div>

              {/* Irradiância Solar Média (HSP) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#A8A49D] block mb-1.5 flex items-center justify-between">
                  <span>Irradiância (HSP)</span>
                  <span className="text-[10px] text-[#EE4A22] font-semibold">kWh/m²/dia</span>
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="2.0"
                  max="7.0"
                  value={hspCustom}
                  onChange={(e) => setHspCustom(Number(e.target.value))}
                  className="w-full bg-[#0D0D0D] border border-[#2E2B26] rounded-xl px-3 py-2 text-sm font-bold text-[#EE4A22] font-mono focus:outline-none focus:border-[#EE4A22]"
                />
              </div>

              {/* Tarifa com Impostos */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#A8A49D] block mb-1.5 flex items-center justify-between">
                  <span>Tarifa de Energia</span>
                  <span className="text-[10px] text-[#A8A49D]">R$/kWh</span>
                </label>
                <input
                  type="number"
                  step="0.02"
                  min="0.30"
                  max="2.50"
                  value={tarifaKwh}
                  onChange={(e) => setTarifaKwh(Number(e.target.value))}
                  className="w-full bg-[#0D0D0D] border border-[#2E2B26] rounded-xl px-3 py-2 text-sm font-bold text-[#10B981] font-mono focus:outline-none focus:border-[#EE4A22]"
                />
              </div>
            </div>

            {/* Estrutura de Fixação & Performance Ratio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1E1C18]">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#A8A49D] block mb-2">
                  Tipo de Fixação / Local
                </label>
                <select
                  value={tipoEstrutura}
                  onChange={(e) => setTipoEstrutura(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-[#2E2B26] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#EE4A22]"
                >
                  {TIPOS_ESTRUTURA.map((est) => (
                    <option key={est.id} value={est.id}>
                      {est.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#A8A49D]">
                    Performance Ratio (PR)
                  </label>
                  <span className="text-xs font-bold text-[#EE4A22] font-mono">{performanceRatio}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="65"
                    max="88"
                    step="1"
                    value={performanceRatio}
                    onChange={(e) => setPerformanceRatio(Number(e.target.value))}
                    className="flex-1 accent-[#EE4A22] h-2 bg-[#1E1C18] rounded-lg cursor-pointer"
                  />
                  <span className="text-[11px] text-[#A8A49D] whitespace-nowrap">
                    {100 - performanceRatio}% perdas globais
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Seleção e Configuração de Módulos */}
          <div className="bg-[#141310] border border-[#1E1C18] rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E1C18] pb-4">
              <h3 className="font-bold text-lg text-white flex items-center gap-2 font-display">
                <Sun className="text-[#EE4A22]" size={20} />
                Módulos Fotovoltaicos
              </h3>
              <span className="text-xs text-[#A8A49D]">
                Sugestão ideal: <strong className="text-white font-mono">{dadosDimensionamento.qtdModulosSugerida} painéis</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#A8A49D] block mb-2">
                  Tecnologia & Potência do Painel
                </label>
                <select
                  value={moduloSelecionadoId}
                  onChange={(e) => {
                    const mod = MODULOS_PADRAO.find(m => m.id === e.target.value)
                    setModuloSelecionadoId(e.target.value)
                    if (mod) setPotenciaModuloCustom(mod.potenciaW)
                    setQtdModulosManual(null)
                  }}
                  className="w-full bg-[#0D0D0D] border border-[#2E2B26] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#EE4A22]"
                >
                  {MODULOS_PADRAO.map((mod) => (
                    <option key={mod.id} value={mod.id}>
                      {mod.nome} ({mod.marca})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#A8A49D] block mb-2">
                  Quantidade Adotada de Módulos
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const novaQtd = Math.max(1, (dadosDimensionamento.qtdModulosReal - 1))
                      setQtdModulosManual(novaQtd)
                    }}
                    className="w-10 h-10 rounded-xl bg-[#1E1C18] hover:bg-[#2E2B26] text-white font-bold flex items-center justify-center text-lg active:scale-90 cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={dadosDimensionamento.qtdModulosReal}
                    onChange={(e) => setQtdModulosManual(Math.max(1, Number(e.target.value) || 1))}
                    className="flex-1 text-center bg-[#0D0D0D] border border-[#2E2B26] rounded-xl py-2 font-bold text-lg text-[#EE4A22] font-mono focus:outline-none focus:border-[#EE4A22]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const novaQtd = dadosDimensionamento.qtdModulosReal + 1
                      setQtdModulosManual(novaQtd)
                    }}
                    className="w-10 h-10 rounded-xl bg-[#1E1C18] hover:bg-[#2E2B26] text-white font-bold flex items-center justify-center text-lg active:scale-90 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Simultaneidade & Custo do Fio B (Lei 14.300) */}
          <div className="bg-[#141310] border border-[#1E1C18] rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E1C18] pb-4">
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2 font-display">
                  <Scale className="text-[#EE4A22]" size={20} />
                  Simultaneidade & Custo do Fio B (Lei 14.300)
                </h3>
                <p className="text-xs text-[#A8A49D] mt-1">
                  O Fio B incide somente sobre a energia injetada na rede após deduzir o consumo instantâneo.
                </p>
              </div>
              <span className="text-xs bg-[#EE4A22]/10 text-[#EE4A22] border border-[#EE4A22]/30 px-3 py-1 rounded-full font-bold self-start sm:self-auto">
                Prevalência do Maior Valor
              </span>
            </div>

            {/* Slider de Simultaneidade */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#F5F5F4] flex items-center gap-1.5">
                    <Zap size={14} className="text-[#EE4A22]" />
                    Simultaneidade (Consumo Instantâneo)
                  </label>
                  <span className="text-[11px] text-[#A8A49D] block">
                    Energia consumida no momento da geração (isenta de Fio B)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={simultaneidade}
                    onChange={(e) => setSimultaneidade(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                    className="w-20 text-right bg-[#0D0D0D] border border-[#2E2B26] rounded-xl px-3 py-1.5 text-base font-bold text-[#EE4A22] font-mono focus:outline-none focus:border-[#EE4A22]"
                  />
                  <span className="text-sm font-bold text-[#A8A49D]">%</span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={simultaneidade}
                onChange={(e) => setSimultaneidade(Number(e.target.value))}
                className="w-full accent-[#EE4A22] h-2 bg-[#1E1C18] rounded-lg cursor-pointer"
              />

              {/* Perfis rápidos de simultaneidade */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {PERFIS_SIMULTANEIDADE.map((perfil) => (
                  <button
                    key={perfil.id}
                    type="button"
                    onClick={() => setSimultaneidade(perfil.valor)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      simultaneidade === perfil.valor
                        ? 'bg-[#EE4A22]/15 border-[#EE4A22] text-[#F79571] shadow-md'
                        : 'bg-[#0D0D0D] border-[#1E1C18] text-[#A8A49D] hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold block">{perfil.nome}</span>
                    <span className="text-[11px] font-extrabold text-[#EE4A22] font-mono">{perfil.valor}%</span>
                  </button>
                ))}
              </div>

              {/* Caixa didática de fluxo da energia */}
              <div className="bg-[#0D0D0D] p-4 rounded-2xl border border-[#1E1C18] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#A8A49D] gap-2">
                  <span>⚡ Demanda / Geração Base:</span>
                  <strong className="text-white text-sm font-mono">{Math.round(calculoFioB.energiaBase)} kWh/mês</strong>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#1E1C18]">
                  <div className="bg-[#10B981]/10 border border-[#10B981]/30 p-3.5 rounded-xl">
                    <span className="text-[11px] text-[#10B981] font-bold uppercase tracking-wider block font-display">
                      Consumo Instantâneo (Simultâneo)
                    </span>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-white font-mono">
                        {Math.round(calculoFioB.energiaSimultaneaKwh)}
                      </span>
                      <span className="text-xs text-[#10B981] font-semibold">kWh ({calculoFioB.pctSimult}%)</span>
                    </div>
                    <span className="text-[10px] text-[#10B981]/90 mt-1 block font-medium">
                      ✅ 100% isento de Fio B
                    </span>
                  </div>

                  <div className="bg-[#3B82F6]/10 border border-[#3B82F6]/30 p-3.5 rounded-xl">
                    <span className="text-[11px] text-[#3B82F6] font-bold uppercase tracking-wider block font-display">
                      Energia Injetada na Rede
                    </span>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-white font-mono">
                        {Math.round(calculoFioB.energiaInjetadaKwh)}
                      </span>
                      <span className="text-xs text-[#3B82F6] font-semibold">kWh ({100 - calculoFioB.pctSimult}%)</span>
                    </div>
                    <span className="text-[10px] text-[#3B82F6]/90 mt-1 block font-medium">
                      ⚡ Base de incidência do Fio B
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Parâmetros do Fio B e Ano de Transição */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#1E1C18]">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#A8A49D] block mb-1.5">
                  Tarifa TUSD Fio B
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.01"
                    min="0.10"
                    max="0.80"
                    value={tarifaFioBIntegral}
                    onChange={(e) => setTarifaFioBIntegral(Number(e.target.value) || 0)}
                    className="w-full bg-[#0D0D0D] border border-[#2E2B26] rounded-xl px-3 py-2 text-xs font-bold text-[#EE4A22] font-mono focus:outline-none focus:border-[#EE4A22]"
                  />
                  <span className="text-[11px] text-[#A8A49D] font-bold">R$/kWh</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#A8A49D] block mb-1.5">
                  Ano de Transição (Lei 14.300)
                </label>
                <select
                  value={anoTransicaoFioB}
                  onChange={(e) => setAnoTransicaoFioB(Number(e.target.value))}
                  className="w-full bg-[#0D0D0D] border border-[#2E2B26] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EE4A22]"
                >
                  {REGRAS_TRANSICAO_FIO_B.map((regra) => (
                    <option key={regra.ano} value={regra.ano}>
                      Ano {regra.ano} ({regra.percentual}% do Fio B) {regra.atual ? '★ 2026 Atual' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#A8A49D] block mb-1.5">
                  Alíquota Efetiva do Fio B
                </label>
                <div className="px-3 py-2 bg-[#0D0D0D] border border-[#2E2B26] rounded-xl text-xs font-bold text-[#3B82F6] flex items-center justify-between font-mono">
                  <span>{calculoFioB.pctTransicao}% aplicada</span>
                  <span>{formatCurrency(calculoFioB.tarifaFioBEfetiva)}/kWh</span>
                </div>
              </div>
            </div>

            {/* DUELO DE PREVALÊNCIA: FIO B vs TARIFA MÍNIMA */}
            <div className="pt-2 border-t border-[#1E1C18] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F5F5F4] font-display">
                  Comparativo de Cobrança: Fio B vs Custo de Disponibilidade
                </span>
                <span className="text-[11px] text-[#A8A49D]">
                  Prevalece o de maior valor
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bloco Fio B */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  calculoFioB.prevaleceFioB
                    ? 'bg-[#EE4A22]/10 border-[#EE4A22]/50 shadow-[0_4px_16px_rgba(238,74,34,0.15)]'
                    : 'bg-[#0D0D0D] border-[#1E1C18] opacity-75'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#A8A49D] uppercase font-display">
                      Custo do Fio B Injetado
                    </span>
                    {calculoFioB.prevaleceFioB && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EE4A22] text-white font-extrabold uppercase">
                        Prevalece
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white font-mono">
                      {formatCurrency(calculoFioB.valorFioBCobrado)}
                    </span>
                    <span className="text-xs text-[#A8A49D]">/mês</span>
                  </div>
                  <span className="text-[11px] text-[#A8A49D] mt-1 block">
                    {Math.round(calculoFioB.energiaInjetadaKwh)} kWh injetados × {formatCurrency(calculoFioB.tarifaFioBEfetiva)}/kWh
                  </span>
                </div>

                {/* Bloco Custo de Disponibilidade */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  !calculoFioB.prevaleceFioB
                    ? 'bg-[#3B82F6]/10 border-[#3B82F6]/50 shadow-[0_4px_16px_rgba(59,130,246,0.15)]'
                    : 'bg-[#0D0D0D] border-[#1E1C18] opacity-75'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#A8A49D] uppercase font-display">
                      Custo de Disponibilidade (Tarifa Mínima)
                    </span>
                    {!calculoFioB.prevaleceFioB && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3B82F6] text-white font-extrabold uppercase">
                        Prevalece
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white font-mono">
                      {formatCurrency(calculoFioB.valorDisponibilidade)}
                    </span>
                    <span className="text-xs text-[#A8A49D]">/mês</span>
                  </div>
                  <span className="text-[11px] text-[#A8A49D] mt-1 block">
                    {calculoFioB.kwhDisponibilidade} kWh ({tipoLigacao}) × {formatCurrency(tarifaKwh)}/kWh
                  </span>
                </div>
              </div>

              {/* BANNER RESULTADO DA PREVALÊNCIA */}
              <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                calculoFioB.prevaleceFioB
                  ? 'bg-gradient-to-r from-[#EE4A22]/15 via-[#141310] to-[#141310] border-[#EE4A22]/40 text-[#F79571]'
                  : 'bg-gradient-to-r from-[#3B82F6]/15 via-[#141310] to-[#141310] border-[#3B82F6]/40 text-[#93C5FD]'
              }`}>
                <Scale className="shrink-0 mt-0.5 text-[#EE4A22]" size={22} />
                <div className="text-xs space-y-1">
                  <strong className="text-sm font-extrabold text-white block font-display">
                    {calculoFioB.prevaleceFioB
                      ? `🏆 Prevalece a Cobrança do Fio B: ${formatCurrency(calculoFioB.valorFioBCobrado)}/mês`
                      : `🏆 Prevalece o Custo de Disponibilidade: ${formatCurrency(calculoFioB.valorDisponibilidade)}/mês`}
                  </strong>
                  <p className="text-[#A8A49D] leading-relaxed">
                    {calculoFioB.prevaleceFioB
                      ? `Como o Fio B calculado (${formatCurrency(calculoFioB.valorFioBCobrado)}) superou a tarifa mínima (${formatCurrency(calculoFioB.valorDisponibilidade)}), o valor cobrado pela distribuidora referente ao uso da rede será de ${formatCurrency(calculoFioB.valorFioBCobrado)}.`
                      : `Como o Fio B calculado (${formatCurrency(calculoFioB.valorFioBCobrado)}) ficou abaixo do custo de disponibilidade (${formatCurrency(calculoFioB.valorDisponibilidade)}), não há dupla cobrança: prevalece a tarifa mínima de ${formatCurrency(calculoFioB.valorDisponibilidade)}.`}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* COLUNA DIREITA: RESULTADOS TÉCNICOS & GRÁFICO */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card Resumo do Sistema Dimensionado */}
          <div className="card-solar p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#2E2B26] pb-3">
              <h3 className="font-bold text-lg text-white flex items-center gap-2 font-display">
                <Sparkles className="text-[#EE4A22]" size={18} />
                Resultado do Dimensionamento
              </h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-semibold font-display">
                Otimizado
              </span>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-[#2E2B26]/60">
                <span className="text-[#A8A49D]">Potência Instalada (kWp):</span>
                <span className="text-base font-extrabold text-white font-mono">
                  {formatNumber(dadosDimensionamento.potenciaRealKwp, 2)} kWp
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#2E2B26]/60">
                <span className="text-[#A8A49D]">Arranjo de Módulos:</span>
                <span className="font-semibold text-[#F5F5F4]">
                  {dadosDimensionamento.qtdModulosReal}x Módulos {dadosDimensionamento.potenciaWpUnit}W
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#2E2B26]/60">
                <span className="text-[#A8A49D]">Inversor Recomendado:</span>
                <span className="font-bold text-[#EE4A22]">
                  {dadosDimensionamento.inversorSugerido.nome}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#2E2B26]/60">
                <span className="text-[#A8A49D]">Autoconsumo Simultâneo:</span>
                <span className="font-semibold text-[#10B981] font-mono">
                  ~{Math.round(calculoFioB.energiaSimultaneaKwh)} kWh/mês ({calculoFioB.pctSimult}%)
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#2E2B26]/60">
                <span className="text-[#A8A49D]">Energia Injetada na Rede:</span>
                <span className="font-semibold text-[#3B82F6] font-mono">
                  ~{Math.round(calculoFioB.energiaInjetadaKwh)} kWh/mês
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#2E2B26]/60">
                <span className="text-[#A8A49D]">Faturamento Distribuidora:</span>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-white block font-mono">
                    {formatCurrency(calculoFioB.valorFaturadoConcessionaria)}/mês
                  </span>
                  <span className="text-[10px] text-[#EE4A22] font-semibold">
                    {calculoFioB.prevaleceFioB ? '(Prevalece Fio B)' : '(Prevalece Tarifa Mínima)'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#2E2B26]/60">
                <span className="text-[#A8A49D]">Área de Telhado Estimada:</span>
                <span className="font-semibold text-white font-mono">
                  ~{Math.round(dadosDimensionamento.areaEstimadaM2)} m²
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-[#A8A49D]">Economia Líquida Real:</span>
                <div className="text-right">
                  <span className="text-base font-black text-[#10B981] block font-mono">
                    ~{formatCurrency(calculoFioB.economiaLiquidaMensal)}/mês
                  </span>
                  <span className="text-[11px] text-[#10B981]/90 font-semibold font-mono">
                    ~{formatCurrency(calculoFioB.economiaLiquidaAnual)}/ano
                  </span>
                </div>
              </div>
            </div>

            {/* Ações de Continuidade */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  sincronizarModulosComDimensionamento()
                  onNavigate?.('custos')
                }}
                className="w-full py-3.5 bg-[#EE4A22] hover:bg-[#D33A15] text-white font-extrabold rounded-2xl shadow-[0_4px_16px_rgba(238,74,34,0.28)] flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer font-display"
              >
                <span>Avançar para Custos & Precificação</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={() => onNavigate?.('viabilidade')}
                className="w-full py-2.5 bg-[#1E1C18] hover:bg-[#2E2B26] text-[#F5F5F4] font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FileSpreadsheet size={16} className="text-[#10B981]" />
                <span>Simular Payback na Viabilidade Financeira</span>
              </button>
            </div>
          </div>

          {/* Gráfico de Sazonalidade: Consumo vs Geração */}
          <div className="bg-[#141310] border border-[#1E1C18] rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-white flex items-center gap-2 font-display">
                <TrendingUp size={16} className="text-[#EE4A22]" />
                Balanço Mensal: Consumo vs Geração (kWh)
              </h4>
            </div>

            <div className="h-64 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
                <BarChart data={dadosDimensionamento.dadosGraficoMensal} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="mes" stroke="#6E6A62" fontSize={11} tickLine={false} />
                  <YAxis stroke="#6E6A62" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#141310', borderColor: '#2E2B26', borderRadius: '12px', fontSize: '12px', color: '#F5F5F4' }}
                    formatter={(val) => [`${val} kWh`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Bar dataKey="Consumo" fill="#47433C" radius={[4, 4, 0, 0]} name="Consumo" />
                  <Bar dataKey="Geracao" fill="#EE4A22" radius={[4, 4, 0, 0]} name="Geração Estimada" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
