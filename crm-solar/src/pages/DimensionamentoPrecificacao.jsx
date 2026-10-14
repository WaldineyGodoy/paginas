import React, { useState, useMemo } from 'react'
import {
  Sun,
  Calculator,
  Zap,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Copy,
  Printer,
  HelpCircle,
  Plus,
  Trash2,
  Layers,
  Wrench,
  ShieldCheck,
  Percent,
  Sliders,
  DollarSign,
  PieChart as PieIcon,
  ChevronRight,
  Info,
  RefreshCw,
  Sparkles,
  FileText,
  Scale,
  ArrowRight,
  ShieldAlert
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  UF_DATA,
  MESES_NOMES,
  TIPOS_ESTRUTURA,
  TIPOS_LIGACAO,
  MODULOS_PADRAO,
  INVERSORES_PADRAO,
  MATERIAIS_CA_DEFAULT,
  REGRAS_TRANSICAO_FIO_B,
  PERFIS_SIMULTANEIDADE,
  formatCurrency,
  formatNumber
} from '../lib/solarData'

export default function DimensionamentoPrecificacao() {
  // -------------------------------------------------------------
  // ESTADO 1: LOCALIZAÇÃO & CONCESSIONÁRIA
  // -------------------------------------------------------------
  const [cep, setCep] = useState('01310-100')
  const [loadingCep, setLoadingCep] = useState(false)
  const [cepError, setCepError] = useState('')
  const [cidade, setCidade] = useState('São Paulo')
  const [uf, setUf] = useState('SP')
  const [concessionaria, setConcessionaria] = useState(UF_DATA.SP.concessionaria)
  const [hspCustom, setHspCustom] = useState(UF_DATA.SP.irradiacaoMedia)
  const [tarifaKwh, setTarifaKwh] = useState(UF_DATA.SP.tarifa)
  const [mensalHsp, setMensalHsp] = useState(UF_DATA.SP.mensal)

  // -------------------------------------------------------------
  // ESTADO 2: DEMANDA ENERGÉTICA E PARÂMETROS TÉCNICOS
  // -------------------------------------------------------------
  const [consumoMensal, setConsumoMensal] = useState(650) // kWh/mês
  const [tipoLigacao, setTipoLigacao] = useState('bifasico') // 50 kWh custo disp
  const [descontarDisponibilidade, setDescontarDisponibilidade] = useState(true)
  const [performanceRatio, setPerformanceRatio] = useState(80) // 80% (PR)
  const [tipoEstrutura, setTipoEstrutura] = useState('telhado_ceramico')
  const [moduloSelecionadoId, setModuloSelecionadoId] = useState('mod_580')
  const [potenciaModuloCustom, setPotenciaModuloCustom] = useState(580) // Wp
  const [qtdModulosManual, setQtdModulosManual] = useState(null) // se o usuário alterar manualmente

  // -------------------------------------------------------------
  // ESTADO: SIMULTANEIDADE & FIO B (LEI 14.300)
  // -------------------------------------------------------------
  const [simultaneidade, setSimultaneidade] = useState(40) // 40% de consumo instantâneo
  const [tarifaFioBIntegral, setTarifaFioBIntegral] = useState(0.28) // R$ 0,28 / kWh
  const [anoTransicaoFioB, setAnoTransicaoFioB] = useState(2026) // 2026 = 60%
  const [taxaIluminacaoPublica, setTaxaIluminacaoPublica] = useState(35.0) // R$ 35,00 CIP

  // -------------------------------------------------------------
  // ESTADO 3: CUSTO DE EQUIPAMENTOS (LADO CC / GERAÇÃO)
  // -------------------------------------------------------------
  const [modoEquipamento, setModoEquipamento] = useState('kit') // 'kit' | 'avulso'
  
  // Kit Fotovoltaico Fechado
  const [kitFechado, setKitFechado] = useState({
    distribuidor: 'Aldo Solar / Solen',
    descricao: 'Kit Completo N-Type TOPCon c/ Inversor Deye + Estrutura + Cabos CC',
    valor: 14800,
    frete: 450
  })

  // Equipamentos Avulsos
  const [equipamentosAvulsos, setEquipamentosAvulsos] = useState([
    { id: 'eq_modulos', nome: 'Módulos Fotovoltaicos 580W TOPCon', categoria: 'Módulos', qtd: 10, valorUnit: 375, custom: false },
    { id: 'eq_inversor', nome: 'Inversor String 5.0 kW Monofásico/Bifásico', categoria: 'Inversor', qtd: 1, valorUnit: 3800, custom: false },
    { id: 'eq_estrutura', nome: 'Estrutura Fixação Telhado Cerâmico', categoria: 'Estrutura', qtd: 10, valorUnit: 65, custom: false },
    { id: 'eq_cabos_cc', nome: 'Cabos Solares CC 4mm² (Preto/Vermelho 1.8kV)', categoria: 'Cabos CC', qtd: 80, valorUnit: 6.5, custom: false },
    { id: 'eq_mc4_string', nome: 'Conectores MC4 (Pares) + Stringbox CC', categoria: 'Proteção CC', qtd: 4, valorUnit: 120, custom: false }
  ])

  // -------------------------------------------------------------
  // ESTADO 4: MATERIAL ELÉTRICO CA (CORRENTE ALTERNADA)
  // -------------------------------------------------------------
  const [modoMaterialCA, setModoMaterialCA] = useState('kit') // 'kit' | 'avulso'

  // Kit Material CA Fechado
  const [kitMaterialCA, setKitMaterialCA] = useState({
    nomePacote: 'Kit Material Elétrico Padrão CA (até 8 kW)',
    descricao: 'Cabos flex 10mm² (25m), Disjuntor Bi/Tri, DPS Classe II Clamper, QGBT Sobrepor, Eletrodutos e conexões, buchas/terminais',
    valor: 1250
  })

  // Materiais CA Avulsos
  const [materiaisCAAvulsos, setMateriaisCAAvulsos] = useState(MATERIAIS_CA_DEFAULT)

  // -------------------------------------------------------------
  // ESTADO 5: MÃO DE OBRA E ENGENHARIA
  // -------------------------------------------------------------
  const [tipoCalculoInstalacao, setTipoCalculoInstalacao] = useState('por_wp') // 'por_wp' | 'por_modulo' | 'fixo'
  const [valorUnitInstalacao, setValorUnitInstalacao] = useState(0.55) // R$ 0,55 / Wp
  const [adicionaisInstalacao, setAdicionaisInstalacao] = useState(300) // deslocamento, andaimes, diárias
  
  const [custosEngenharia, setCustosEngenharia] = useState({
    projetoEletrico: 800, // Projeto e diagramas
    artTrt: 250,          // Taxa ART (CREA) / TRT (CFT)
    homologacao: 600      // Trâmite comissionamento e concessionária
  })

  const [outrosCustos, setOutrosCustos] = useState({
    freteGeral: 250,
    seguroObra: 150
  })

  // -------------------------------------------------------------
  // ESTADO 6: POLÍTICA COMERCIAL, MARKUP E MARGEM
  // -------------------------------------------------------------
  const [tipoPrecificacao, setTipoPrecificacao] = useState('por_dentro') // 'por_dentro' (markup divisor) | 'multiplicador' (por fora)
  const [margemLucroDesejada, setMargemLucroDesejada] = useState(22) // 22%
  const [aliquotaImposto, setAliquotaImposto] = useState(6.5) // 6.5% Simples Nacional
  const [comissaoVendas, setComissaoVendas] = useState(4.0) // 4.0%
  const [reservaTecnica, setReservaTecnica] = useState(1.5) // 1.5% contingência

  // Controle de Abas Visuais
  const [abaAtiva, setAbaAtiva] = useState('dimensionamento') // 'dimensionamento' | 'custos' | 'precificacao' | 'resumo'
  const [copiadoWhatsapp, setCopiadoWhatsapp] = useState(false)

  // =============================================================
  // MOTOR DE CÁLCULO DE ENGENHARIA SOLAR (DIMENSIONAMENTO)
  // =============================================================
  const dadosDimensionamento = useMemo(() => {
    // 1. Custo de disponibilidade (taxa mínima)
    const ligacaoObj = TIPOS_LIGACAO.find(l => l.id === tipoLigacao) || TIPOS_LIGACAO[1]
    const custoDisponibilidade = descontarDisponibilidade ? ligacaoObj.custoKwh : 0
    const consumoLiquidoCompensavel = Math.max(0, consumoMensal - custoDisponibilidade)

    // 2. Demanda diária
    const demandaDiariaKwh = consumoLiquidoCompensavel / 30

    // 3. Potência teórica necessária (kWp) = Demanda Diária / (HSP * PR)
    const prDecimal = performanceRatio / 100
    const hspEfetivo = Math.max(1, Number(hspCustom) || 4.5)
    const potenciaCalculadaKwp = demandaDiariaKwh / (hspEfetivo * prDecimal)

    // 4. Quantidade de módulos necessária
    const moduloObj = MODULOS_PADRAO.find(m => m.id === moduloSelecionadoId) || MODULOS_PADRAO[1]
    const potenciaWpUnit = potenciaModuloCustom || moduloObj.potenciaW
    const qtdModulosSugerida = Math.ceil((potenciaCalculadaKwp * 1000) / potenciaWpUnit)
    
    // Qtd real adotada (respeita ajuste manual se houver)
    const qtdModulosReal = qtdModulosManual !== null ? qtdModulosManual : qtdModulosSugerida
    const potenciaRealKwp = (qtdModulosReal * potenciaWpUnit) / 1000

    // 5. Dimensionamento do Inversor sugerido (Fator de Sobredimensionamento CC/CA típico 1.15 a 1.30)
    const potenciaInversorSugeridaKw = potenciaRealKwp / 1.25
    let inversorSugerido = INVERSORES_PADRAO[0]
    for (const inv of INVERSORES_PADRAO) {
      if (inv.potenciaKw >= potenciaInversorSugeridaKw) {
        inversorSugerido = inv
        break
      }
      inversorSugerido = inv
    }

    // 6. Área estimada (m²) e peso aproximado
    const areaEstimadaM2 = qtdModulosReal * moduloObj.areaM2
    const pesoEstimadoKg = qtdModulosReal * 28 // ~28kg por painel com cabos e trilhos

    // 7. Geração mensal média e sazonalidade nos 12 meses
    const geracaoMensalMediaKwh = potenciaRealKwp * hspEfetivo * 30 * prDecimal
    const geracaoAnualEstimadaKwh = geracaoMensalMediaKwh * 12
    const economiaMensalEstimada = geracaoMensalMediaKwh * tarifaKwh

    // Geração mês a mês
    const dadosGraficoMensal = MESES_NOMES.map((mes, idx) => {
      const hspMes = mensalHsp[idx] || hspEfetivo
      const diasMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][idx]
      const geracaoMes = Math.round(potenciaRealKwp * hspMes * diasMes * prDecimal)
      return {
        mes,
        Consumo: consumoMensal,
        Geracao: geracaoMes,
        hsp: hspMes
      }
    })

    return {
      custoDisponibilidade,
      consumoLiquidoCompensavel,
      demandaDiariaKwh,
      potenciaCalculadaKwp,
      potenciaWpUnit,
      qtdModulosSugerida,
      qtdModulosReal,
      potenciaRealKwp,
      inversorSugerido,
      areaEstimadaM2,
      pesoEstimadoKg,
      geracaoMensalMediaKwh,
      geracaoAnualEstimadaKwh,
      economiaMensalEstimada,
      dadosGraficoMensal,
      moduloObj
    }
  }, [
    consumoMensal,
    tipoLigacao,
    descontarDisponibilidade,
    performanceRatio,
    hspCustom,
    moduloSelecionadoId,
    potenciaModuloCustom,
    qtdModulosManual,
    tarifaKwh,
    mensalHsp
  ])

  // =============================================================
  // MOTOR DE CÁLCULO DE SIMULTANEIDADE & FIO B (LEI 14.300)
  // =============================================================
  const calculoFioB = useMemo(() => {
    // 1. Energia base mensal considerada (geração média estimada do sistema)
    const energiaBase = dadosDimensionamento.geracaoMensalMediaKwh || consumoMensal || 500

    // 2. Simultaneidade: porcentagem de autoconsumo instantâneo sobre a geração
    const pctSimult = Math.min(100, Math.max(0, Number(simultaneidade) || 0))
    const energiaSimultaneaKwh = energiaBase * (pctSimult / 100)

    // 3. Energia injetada na rede (base de incidência da cobrança do Fio B)
    // Se a simultaneidade for de 40% em 500 kWh, o injetado é 300 kWh
    const energiaInjetadaKwh = Math.max(0, energiaBase - energiaSimultaneaKwh)

    // 4. Regra de transição da Lei 14.300
    const regraTransicao = REGRAS_TRANSICAO_FIO_B.find(r => r.ano === Number(anoTransicaoFioB)) || { percentual: 60 }
    const pctTransicao = regraTransicao.percentual
    const tarifaFioBEfetiva = Number(tarifaFioBIntegral || 0.28) * (pctTransicao / 100)

    // 5. Custo do Fio B cobrado sobre o valor injetado
    const valorFioBCobrado = energiaInjetadaKwh * tarifaFioBEfetiva

    // 6. Custo de Disponibilidade (Tarifa Mínima da Concessionária)
    const ligacaoObj = TIPOS_LIGACAO.find(l => l.id === tipoLigacao) || TIPOS_LIGACAO[1]
    const kwhDisponibilidade = ligacaoObj.custoKwh // 30 (mono), 50 (bi), 100 (tri)
    const valorDisponibilidade = kwhDisponibilidade * tarifaKwh

    // 7. REGRA DE PREVALÊNCIA (Art. 16 Lei 14.300 / REN 1000)
    // "caso o valor do Fio B cobrado seja menor que a Tarifa minima, cobra-se o custo de disponibilidade.
    // ou seja nas cobranças de Fio B e Custo de Disponibilidade, prevalece o de maior valor"
    const prevaleceFioB = valorFioBCobrado >= valorDisponibilidade
    const valorFaturadoConcessionaria = Math.max(valorDisponibilidade, valorFioBCobrado)
    const diferencaPrevalencia = Math.abs(valorFioBCobrado - valorDisponibilidade)

    // 8. Fatura Total Pós-Solar estimada (Energia faturada + Iluminação Pública CIP)
    const faturaPosSolar = valorFaturadoConcessionaria + Number(taxaIluminacaoPublica || 0)

    // 9. Fatura Antes do Solar (Sem sistema fotovoltaico)
    const faturaSemSolar = (consumoMensal * tarifaKwh) + Number(taxaIluminacaoPublica || 0)

    // 10. Economia Líquida Real do Cliente (Mensal e Anual)
    const economiaLiquidaMensal = Math.max(0, faturaSemSolar - faturaPosSolar)
    const economiaLiquidaAnual = economiaLiquidaMensal * 12

    return {
      energiaBase,
      pctSimult,
      energiaSimultaneaKwh,
      energiaInjetadaKwh,
      pctTransicao,
      tarifaFioBEfetiva,
      valorFioBCobrado,
      kwhDisponibilidade,
      valorDisponibilidade,
      prevaleceFioB,
      valorFaturadoConcessionaria,
      diferencaPrevalencia,
      faturaPosSolar,
      faturaSemSolar,
      economiaLiquidaMensal,
      economiaLiquidaAnual
    }
  }, [
    dadosDimensionamento.geracaoMensalMediaKwh,
    consumoMensal,
    simultaneidade,
    anoTransicaoFioB,
    tarifaFioBIntegral,
    tipoLigacao,
    tarifaKwh,
    taxaIluminacaoPublica
  ])

  // =============================================================
  // MOTOR DE CUSTOS DIRETOS (CPV - CUSTO DO PROJETO)
  // =============================================================
  const custosTotais = useMemo(() => {
    // 1. Custos de Equipamentos (Lado CC)
    let totalEquipamentos = 0
    if (modoEquipamento === 'kit') {
      totalEquipamentos = Number(kitFechado.valor) + Number(kitFechado.frete || 0)
    } else {
      totalEquipamentos = equipamentosAvulsos.reduce((acc, item) => acc + (item.qtd * item.valorUnit), 0)
    }

    // 2. Custos de Material CA
    let totalMaterialCA = 0
    if (modoMaterialCA === 'kit') {
      totalMaterialCA = Number(kitMaterialCA.valor)
    } else {
      totalMaterialCA = materiaisCAAvulsos.reduce((acc, item) => acc + (item.qtd * item.valorUnit), 0)
    }

    // 3. Custos de Mão de Obra de Instalação
    let totalInstalacao = 0
    if (tipoCalculoInstalacao === 'por_wp') {
      totalInstalacao = (dadosDimensionamento.potenciaRealKwp * 1000) * valorUnitInstalacao
    } else if (tipoCalculoInstalacao === 'por_modulo') {
      totalInstalacao = dadosDimensionamento.qtdModulosReal * valorUnitInstalacao
    } else {
      totalInstalacao = valorUnitInstalacao
    }
    totalInstalacao += Number(adicionaisInstalacao || 0)

    // 4. Custos de Engenharia & Homologação
    const totalEngenharia =
      Number(custosEngenharia.projetoEletrico || 0) +
      Number(custosEngenharia.artTrt || 0) +
      Number(custosEngenharia.homologacao || 0)

    // 5. Outros Custos Diretos
    const totalOutros =
      Number(outrosCustos.freteGeral || 0) +
      Number(outrosCustos.seguroObra || 0)

    // CUSTO DIRETO TOTAL (CPV)
    const custoDiretoTotal = totalEquipamentos + totalMaterialCA + totalInstalacao + totalEngenharia + totalOutros

    return {
      totalEquipamentos,
      totalMaterialCA,
      totalInstalacao,
      totalEngenharia,
      totalOutros,
      custoDiretoTotal
    }
  }, [
    modoEquipamento,
    kitFechado,
    equipamentosAvulsos,
    modoMaterialCA,
    kitMaterialCA,
    materiaisCAAvulsos,
    tipoCalculoInstalacao,
    valorUnitInstalacao,
    adicionaisInstalacao,
    dadosDimensionamento.potenciaRealKwp,
    dadosDimensionamento.qtdModulosReal,
    custosEngenharia,
    outrosCustos
  ])

  // =============================================================
  // MOTOR DE FORMAÇÃO DO PREÇO DE VENDA (MARKUP & MARGEM)
  // =============================================================
  const formacaoPreco = useMemo(() => {
    const custo = custosTotais.custoDiretoTotal
    const margem = Number(margemLucroDesejada) || 0
    const imposto = Number(aliquotaImposto) || 0
    const comissao = Number(comissaoVendas) || 0
    const contingencia = Number(reservaTecnica) || 0

    const somaPercentuais = (margem + imposto + comissao + contingencia) / 100

    let precoVenda = 0
    let markupMultiplicadorEfetivo = 0

    if (tipoPrecificacao === 'por_dentro') {
      // Mark-up Divisor (Preço de venda = Custo / (1 - Soma Percentuais))
      if (somaPercentuais >= 1) {
        precoVenda = custo * 2 // proteção contra divisão por zero/negativo
      } else {
        precoVenda = custo / (1 - somaPercentuais)
      }
      markupMultiplicadorEfetivo = custo > 0 ? (precoVenda / custo) : 1
    } else {
      // Mark-up Multiplicador (Preço de venda = Custo * (1 + Soma Percentuais))
      precoVenda = custo * (1 + somaPercentuais)
      markupMultiplicadorEfetivo = 1 + somaPercentuais
    }

    const valorImposto = precoVenda * (imposto / 100)
    const valorComissao = precoVenda * (comissao / 100)
    const valorContingencia = precoVenda * (contingencia / 100)
    const receitaLiquida = precoVenda - valorImposto
    const lucroBruto = receitaLiquida - custo
    const lucroLiquido = lucroBruto - valorComissao - valorContingencia
    const margemLiquidaReal = precoVenda > 0 ? (lucroLiquido / precoVenda) * 100 : 0

    // R$/Wp indicador-chave de mercado fotovoltaico
    const wattsPicoTotais = dadosDimensionamento.potenciaRealKwp * 1000
    const precoPorWp = wattsPicoTotais > 0 ? precoVenda / wattsPicoTotais : 0
    const custoPorWp = wattsPicoTotais > 0 ? custo / wattsPicoTotais : 0

    // Payback simples estimado (anos) com dedução real do Fio B e tarifa mínima
    const economiaAnualLiquida = calculoFioB.economiaLiquidaAnual
    const paybackAnos = economiaAnualLiquida > 0 ? precoVenda / economiaAnualLiquida : 0

    // Dados para Gráfico Donut de Composição do Preço de Venda
    const dadosDonut = [
      { name: 'Equipamentos CC', value: Math.round(custosTotais.totalEquipamentos), color: '#3b82f6' },
      { name: 'Material CA', value: Math.round(custosTotais.totalMaterialCA), color: '#06b6d4' },
      { name: 'Instalação', value: Math.round(custosTotais.totalInstalacao), color: '#8b5cf6' },
      { name: 'Engenharia/Projetos', value: Math.round(custosTotais.totalEngenharia), color: '#6366f1' },
      { name: 'Impostos & Comissões', value: Math.round(valorImposto + valorComissao + valorContingencia), color: '#f97316' },
      { name: 'Lucro Líquido', value: Math.max(0, Math.round(lucroLiquido)), color: '#10b981' }
    ]

    return {
      custo,
      precoVenda,
      markupMultiplicadorEfetivo,
      valorImposto,
      valorComissao,
      valorContingencia,
      receitaLiquida,
      lucroBruto,
      lucroLiquido,
      margemLiquidaReal,
      precoPorWp,
      custoPorWp,
      paybackAnos,
      economiaAnualEst: economiaAnualLiquida,
      dadosDonut
    }
  }, [
    custosTotais,
    margemLucroDesejada,
    aliquotaImposto,
    comissaoVendas,
    reservaTecnica,
    tipoPrecificacao,
    dadosDimensionamento.potenciaRealKwp,
    calculoFioB,
    tarifaKwh
  ])

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
      }
    } catch {
      setCepError('Erro ao consultar CEP. Tente novamente.')
    } finally {
      setLoadingCep(false)
    }
  }

  // Sincroniza quantidade de módulos avulsos ao dimensionamento se desejado
  const sincronizarModulosComDimensionamento = () => {
    setEquipamentosAvulsos(prev =>
      prev.map(item => {
        if (item.categoria === 'Módulos') {
          return {
            ...item,
            qtd: dadosDimensionamento.qtdModulosReal,
            valorUnit: dadosDimensionamento.moduloObj.precoUnitario,
            nome: `${dadosDimensionamento.moduloObj.nome}`
          }
        }
        if (item.categoria === 'Estrutura') {
          const estObj = TIPOS_ESTRUTURA.find(e => e.id === tipoEstrutura) || TIPOS_ESTRUTURA[0]
          return {
            ...item,
            qtd: dadosDimensionamento.qtdModulosReal,
            valorUnit: estObj.custoBasePorModulo,
            nome: `Estrutura ${estObj.label}`
          }
        }
        return item
      })
    )
  }

  // Copiar resumo formatado para o WhatsApp
  const handleCopiarWhatsapp = () => {
    const texto = `☀️ *PROPOSTA PRELIMINAR - ENERGIA SOLAR FOTOVOLTAICA*
📍 *Local:* ${cidade} - ${uf} (${concessionaria})
⚡ *Demanda Atual:* ${consumoMensal} kWh/mês

📊 *DIMENSIONAMENTO DO SISTEMA:*
• Potência Instalada: *${formatNumber(dadosDimensionamento.potenciaRealKwp, 2)} kWp*
• Geração Estimada: *~${Math.round(dadosDimensionamento.geracaoMensalMediaKwh)} kWh/mês* (~${Math.round(dadosDimensionamento.geracaoAnualEstimadaKwh)} kWh/ano)
• Painéis: *${dadosDimensionamento.qtdModulosReal}x Módulos de ${dadosDimensionamento.potenciaWpUnit}W*
• Inversor Sugerido: *${dadosDimensionamento.inversorSugerido.potenciaKw} kW*
• Área Necessária: *~${Math.round(dadosDimensionamento.areaEstimadaM2)} m²*

⚡ *ENQUADRAMENTO LEI 14.300 & SIMULTANEIDADE:*
• Consumo Instantâneo (Simultâneo): *${calculoFioB.pctSimult}%* (~${Math.round(calculoFioB.energiaSimultaneaKwh)} kWh/mês isentos de Fio B)
• Energia Injetada na Rede: *~${Math.round(calculoFioB.energiaInjetadaKwh)} kWh/mês*
• Faturamento da Concessionária (*${calculoFioB.prevaleceFioB ? 'Prevalece Fio B' : 'Prevalece Tarifa Mínima'}*): *${formatCurrency(calculoFioB.valorFaturadoConcessionaria)}/mês*
• Economia Líquida Real do Cliente: *~${formatCurrency(calculoFioB.economiaLiquidaMensal)}/mês* (~${formatCurrency(calculoFioB.economiaLiquidaAnual)}/ano)

💰 *PROPOSTA COMERCIAL TURNKEY:*
• Investimento Total: *${formatCurrency(formacaoPreco.precoVenda)}*
• R$/Wp do Projeto: *${formatCurrency(formacaoPreco.precoPorWp)}/Wp*
• Retorno Estimado (Payback Real): *~${formatNumber(formacaoPreco.paybackAnos, 1)} anos*

Incluso no Turnkey: Equipamentos homologados Tier 1, Materiais elétricos CA de proteção, Instalação técnica especializada, Projeto de Engenharia com ART/TRT e Homologação na Concessionária!`

    navigator.clipboard.writeText(texto)
    setCopiadoWhatsapp(true)
    setTimeout(() => setCopiadoWhatsapp(false), 3000)
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto pb-24 font-sans text-slate-100">
      
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-400">
              <Calculator size={22} />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Dimensionamento & Precificação Solar
            </h1>
            <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs px-2.5 py-1 rounded-full font-semibold">
              Turnkey & Avulso
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-2xl">
            Calcule a potência ideal a partir do consumo e irradiância local. Precifique com custos reais de equipamentos CC, materiais CA, engenharia e formação de preço via Markup/Margem.
          </p>
        </div>

        {/* BARRAS DE AÇÃO RÁPIDA */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopiarWhatsapp}
            className={`px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 ${
              copiadoWhatsapp
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {copiadoWhatsapp ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            <span>{copiadoWhatsapp ? 'Copiado para WhatsApp!' : 'Copiar p/ WhatsApp'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-2 transition-all active:scale-95"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* KPI HIGHLIGHT CARDS (RESUMO FLUTUANTE SUPERIOR) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Potência Recomendada */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl pointer-events-none"></div>
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sun size={14} className="text-yellow-400" /> Potência Calculada
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-white">
              {formatNumber(dadosDimensionamento.potenciaRealKwp, 2)}
            </span>
            <span className="text-sm font-semibold text-yellow-400">kWp</span>
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {dadosDimensionamento.qtdModulosReal} painéis de {dadosDimensionamento.potenciaWpUnit}W
          </span>
        </div>

        {/* Geração Média */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
            <Zap size={14} className="text-blue-400" /> Geração Média
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-white">
              {Math.round(dadosDimensionamento.geracaoMensalMediaKwh)}
            </span>
            <span className="text-sm font-semibold text-blue-400">kWh/mês</span>
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            Supre {Math.round((dadosDimensionamento.geracaoMensalMediaKwh / (consumoMensal || 1)) * 100)}% da demanda
          </span>
        </div>

        {/* Custo Direto Total */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none"></div>
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers size={14} className="text-purple-400" /> Custo Direto (CPV)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-white truncate">
              {formatCurrency(custosTotais.custoDiretoTotal)}
            </span>
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            Equipamentos + CA + Mão de Obra
          </span>
        </div>

        {/* Preço de Venda Final */}
        <div className="bg-gradient-to-br from-yellow-500/15 via-slate-900 to-slate-900 border border-yellow-500/40 rounded-2xl p-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-yellow-400 flex items-center gap-1.5">
              <DollarSign size={14} className="text-yellow-400" /> Preço de Venda
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 font-bold border border-yellow-500/30">
              {formatCurrency(formacaoPreco.precoPorWp)}/Wp
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-yellow-400 truncate">
              {formatCurrency(formacaoPreco.precoVenda)}
            </span>
          </div>
          <span className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <TrendingUp size={12} /> Lucro Líquido: {formatCurrency(formacaoPreco.lucroLiquido)} ({formatNumber(formacaoPreco.margemLiquidaReal, 1)}%)
          </span>
        </div>
      </div>

      {/* NAVEGAÇÃO DE ABAS */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'dimensionamento', label: '1. Dimensionamento Solar', icon: Sun },
          { id: 'equipamentos', label: '2. Equipamentos CC (Kit/Avulso)', icon: Layers },
          { id: 'material_ca', label: '3. Material Elétrico CA', icon: Zap },
          { id: 'instalacao_eng', label: '4. Instalação & Engenharia', icon: Wrench },
          { id: 'precificacao', label: '5. Margem & Precificação', icon: Sliders },
          { id: 'resumo', label: '6. DRE & Proposta Final', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = abaAtiva === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setAbaAtiva(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ============================================================= */}
      {/* ABA 1: DIMENSIONAMENTO SOLAR */}
      {/* ============================================================= */}
      {abaAtiva === 'dimensionamento' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* COLUNA ESQUERDA: PARÂMETROS DE ENTRADA */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Card 1: Demanda do Cliente */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <Zap className="text-yellow-400" size={20} />
                    Consumo & Demanda de Energia
                  </h3>
                  <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-medium">
                    Passo Essencial
                  </span>
                </div>

                {/* Consumo Mensal em Destaque com Slider e Stepper */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
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
                          setQtdModulosManual(null) // reseta para recalcular
                        }}
                        className="w-28 text-right bg-slate-950 border border-slate-700 focus:border-yellow-500 rounded-xl px-3 py-1.5 text-lg font-bold text-yellow-400 focus:outline-none"
                      />
                      <span className="text-xs font-semibold text-slate-400">kWh</span>
                    </div>
                  </div>

                  {/* Slider fluído */}
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
                    className="w-full accent-yellow-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
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
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                          consumoMensal === val
                            ? 'bg-yellow-500 text-black font-bold'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
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
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Tipo de Ligação na Rede
                    </label>
                    <select
                      value={tipoLigacao}
                      onChange={(e) => setTipoLigacao(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500"
                    >
                      {TIPOS_LIGACAO.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Desconto Custo de Disponibilidade
                    </label>
                    <div className="flex items-center gap-3 h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <input
                        type="checkbox"
                        id="chkDisponibilidade"
                        checked={descontarDisponibilidade}
                        onChange={(e) => setDescontarDisponibilidade(e.target.checked)}
                        className="w-4 h-4 accent-yellow-500 rounded cursor-pointer"
                      />
                      <label htmlFor="chkDisponibilidade" className="text-xs text-slate-300 cursor-pointer">
                        Descontar {dadosDimensionamento.custoDisponibilidade} kWh (Lei 14.300)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Localização & Irradiância Solar */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <MapPin className="text-yellow-400" size={20} />
                    Localização & Irradiância Solar (HSP)
                  </h3>
                  <span className="text-xs text-yellow-400 font-semibold bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/20">
                    {uf} - {cidade}
                  </span>
                </div>

                {/* Busca CEP */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    CEP da Instalação
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ex: 01310-100"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-yellow-500"
                    />
                    <button
                      type="button"
                      onClick={handleBuscarCep}
                      disabled={loadingCep}
                      className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-800 text-black font-semibold rounded-xl text-sm transition-all shadow-md active:scale-95"
                    >
                      {loadingCep ? 'Buscando...' : 'Buscar CEP'}
                    </button>
                  </div>
                  {cepError && <span className="text-xs text-red-400 block">{cepError}</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {/* Concessionária */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Concessionária
                    </label>
                    <input
                      type="text"
                      value={concessionaria}
                      onChange={(e) => setConcessionaria(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  {/* Irradiância Solar Média (HSP) */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center justify-between">
                      <span>Irradiância (HSP)</span>
                      <span className="text-[10px] text-yellow-400 font-semibold">kWh/m²/dia</span>
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="2.0"
                      max="7.0"
                      value={hspCustom}
                      onChange={(e) => setHspCustom(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold text-yellow-400 focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  {/* Tarifa com Impostos */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center justify-between">
                      <span>Tarifa de Energia</span>
                      <span className="text-[10px] text-slate-400">R$/kWh</span>
                    </label>
                    <input
                      type="number"
                      step="0.02"
                      min="0.30"
                      max="2.50"
                      value={tarifaKwh}
                      onChange={(e) => setTarifaKwh(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold text-emerald-400 focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>

                {/* Estrutura de Fixação & Performance Ratio */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Tipo de Fixação / Local
                    </label>
                    <select
                      value={tipoEstrutura}
                      onChange={(e) => setTipoEstrutura(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500"
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
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Performance Ratio (PR)
                      </label>
                      <span className="text-xs font-bold text-yellow-400">{performanceRatio}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="65"
                        max="88"
                        step="1"
                        value={performanceRatio}
                        onChange={(e) => setPerformanceRatio(Number(e.target.value))}
                        className="flex-1 accent-yellow-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">
                        {100 - performanceRatio}% perdas
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Seleção e Configuração de Módulos */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <Sun className="text-yellow-400" size={20} />
                    Módulos Fotovoltaicos
                  </h3>
                  <span className="text-xs text-slate-400">
                    Sugestão: {dadosDimensionamento.qtdModulosSugerida} painéis
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500"
                    >
                      {MODULOS_PADRAO.map((mod) => (
                        <option key={mod.id} value={mod.id}>
                          {mod.nome} ({mod.marca})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Quantidade Adotada de Módulos
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const novaQtd = Math.max(1, (dadosDimensionamento.qtdModulosReal - 1))
                          setQtdModulosManual(novaQtd)
                        }}
                        className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold flex items-center justify-center text-lg active:scale-90"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={dadosDimensionamento.qtdModulosReal}
                        onChange={(e) => setQtdModulosManual(Math.max(1, Number(e.target.value) || 1))}
                        className="flex-1 text-center bg-slate-950 border border-slate-800 rounded-xl py-2 font-bold text-lg text-yellow-400 focus:outline-none focus:border-yellow-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const novaQtd = dadosDimensionamento.qtdModulosReal + 1
                          setQtdModulosManual(novaQtd)
                        }}
                        className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold flex items-center justify-center text-lg active:scale-90"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Simultaneidade & Custo do Fio B (Lei 14.300) */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                      <Scale className="text-yellow-400" size={20} />
                      Simultaneidade & Custo do Fio B (Lei 14.300)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      O Fio B incide somente sobre a energia injetada na rede após deduzir o consumo instantâneo.
                    </p>
                  </div>
                  <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full font-bold self-start sm:self-auto">
                    Prevalência do Maior Valor
                  </span>
                </div>

                {/* Slider de Simultaneidade */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <Zap size={14} className="text-yellow-400" />
                        Simultaneidade (Consumo Instantâneo)
                      </label>
                      <span className="text-[11px] text-slate-500 block">
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
                        className="w-20 text-right bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-base font-bold text-yellow-400 focus:outline-none focus:border-yellow-500"
                      />
                      <span className="text-sm font-bold text-slate-400">%</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={simultaneidade}
                    onChange={(e) => setSimultaneidade(Number(e.target.value))}
                    className="w-full accent-yellow-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
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
                            ? 'bg-yellow-500/15 border-yellow-500 text-yellow-300 shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="text-xs font-bold block">{perfil.nome}</span>
                        <span className="text-[11px] font-extrabold text-yellow-400">{perfil.valor}%</span>
                      </button>
                    ))}
                  </div>

                  {/* Caixa didática de fluxo da energia */}
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 gap-2">
                      <span>⚡ Demanda / Geração Base:</span>
                      <strong className="text-white text-sm font-mono">{Math.round(calculoFioB.energiaBase)} kWh/mês</strong>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                      <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-xl">
                        <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider block">
                          Consumo Instantâneo (Simultâneo)
                        </span>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="text-xl font-black text-white">
                            {Math.round(calculoFioB.energiaSimultaneaKwh)}
                          </span>
                          <span className="text-xs text-emerald-400 font-semibold">kWh ({calculoFioB.pctSimult}%)</span>
                        </div>
                        <span className="text-[10px] text-emerald-400/90 mt-1 block">
                          ✅ Isento de tarifa Fio B
                        </span>
                      </div>

                      <div className="bg-blue-950/20 border border-blue-500/30 p-3 rounded-xl">
                        <span className="text-[11px] text-blue-400 font-bold uppercase tracking-wider block">
                          Energia Injetada na Rede
                        </span>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="text-xl font-black text-white">
                            {Math.round(calculoFioB.energiaInjetadaKwh)}
                          </span>
                          <span className="text-xs text-blue-400 font-semibold">kWh ({100 - calculoFioB.pctSimult}%)</span>
                        </div>
                        <span className="text-[10px] text-blue-400/90 mt-1 block">
                          ⚡ Base de incidência do Fio B
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parâmetros do Fio B e Ano de Transição */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
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
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-yellow-400 focus:outline-none focus:border-yellow-500"
                      />
                      <span className="text-[11px] text-slate-500 font-bold">R$/kWh</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Ano de Transição (Lei 14.300)
                    </label>
                    <select
                      value={anoTransicaoFioB}
                      onChange={(e) => setAnoTransicaoFioB(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-500"
                    >
                      {REGRAS_TRANSICAO_FIO_B.map((regra) => (
                        <option key={regra.ano} value={regra.ano}>
                          Ano {regra.ano} ({regra.percentual}% do Fio B) {regra.atual ? '★ 2026 Atual' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Alíquota Efetiva do Fio B
                    </label>
                    <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-cyan-400 flex items-center justify-between">
                      <span>{calculoFioB.pctTransicao}% aplicada</span>
                      <span>{formatCurrency(calculoFioB.tarifaFioBEfetiva)}/kWh</span>
                    </div>
                  </div>
                </div>

                {/* DUELO DE PREVALÊNCIA: FIO B vs TARIFA MÍNIMA */}
                <div className="pt-2 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Comparativo de Cobrança: Fio B vs Custo de Disponibilidade
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Prevalece sempre o de maior valor
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Bloco Fio B */}
                    <div className={`p-4 rounded-2xl border transition-all ${
                      calculoFioB.prevaleceFioB
                        ? 'bg-yellow-500/10 border-yellow-500/50 shadow-lg shadow-yellow-500/5'
                        : 'bg-slate-950 border-slate-800 opacity-75'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300 uppercase">
                          Custo do Fio B Injetado
                        </span>
                        {calculoFioB.prevaleceFioB && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500 text-black font-extrabold uppercase">
                            Prevalece
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white">
                          {formatCurrency(calculoFioB.valorFioBCobrado)}
                        </span>
                        <span className="text-xs text-slate-400">/mês</span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        {Math.round(calculoFioB.energiaInjetadaKwh)} kWh injetados × {formatCurrency(calculoFioB.tarifaFioBEfetiva)}/kWh
                      </span>
                    </div>

                    {/* Bloco Custo de Disponibilidade */}
                    <div className={`p-4 rounded-2xl border transition-all ${
                      !calculoFioB.prevaleceFioB
                        ? 'bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/5'
                        : 'bg-slate-950 border-slate-800 opacity-75'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-300 uppercase">
                          Custo de Disponibilidade (Tarifa Mínima)
                        </span>
                        {!calculoFioB.prevaleceFioB && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500 text-white font-extrabold uppercase">
                            Prevalece
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white">
                          {formatCurrency(calculoFioB.valorDisponibilidade)}
                        </span>
                        <span className="text-xs text-slate-400">/mês</span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        {calculoFioB.kwhDisponibilidade} kWh ({tipoLigacao}) × {formatCurrency(tarifaKwh)}/kWh
                      </span>
                    </div>
                  </div>

                  {/* BANNER RESULTADO DA PREVALÊNCIA */}
                  <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                    calculoFioB.prevaleceFioB
                      ? 'bg-gradient-to-r from-yellow-500/15 via-slate-900 to-slate-950 border-yellow-500/40 text-yellow-300'
                      : 'bg-gradient-to-r from-blue-500/15 via-slate-900 to-slate-950 border-blue-500/40 text-blue-300'
                  }`}>
                    <Scale className="shrink-0 mt-0.5 text-yellow-400" size={20} />
                    <div className="text-xs space-y-1">
                      <strong className="text-sm font-extrabold text-white block">
                        {calculoFioB.prevaleceFioB
                          ? `🏆 Prevalece a Cobrança do Fio B: ${formatCurrency(calculoFioB.valorFioBCobrado)}/mês`
                          : `🏆 Prevalece o Custo de Disponibilidade: ${formatCurrency(calculoFioB.valorDisponibilidade)}/mês`}
                      </strong>
                      <p className="text-slate-300">
                        {calculoFioB.prevaleceFioB
                          ? `Como o Fio B (${formatCurrency(calculoFioB.valorFioBCobrado)}) superou a tarifa mínima (${formatCurrency(calculoFioB.valorDisponibilidade)}), o valor cobrado pela distribuidora na fatura referente ao uso da rede será de ${formatCurrency(calculoFioB.valorFioBCobrado)}.`
                          : `Como o Fio B (${formatCurrency(calculoFioB.valorFioBCobrado)}) ficou abaixo do custo de disponibilidade (${formatCurrency(calculoFioB.valorDisponibilidade)}), não há dupla cobrança: prevalece a tarifa mínima de ${formatCurrency(calculoFioB.valorDisponibilidade)}.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* COLUNA DIREITA: RESULTADOS TÉCNICOS & GRÁFICO */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Card Resumo do Sistema Dimensionado */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <Sparkles className="text-yellow-400" size={18} />
                    Resultado do Dimensionamento
                  </h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    100% Otimizado
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                    <span className="text-sm text-slate-400">Potência Total Calculada (kWp):</span>
                    <span className="text-base font-extrabold text-white">
                      {formatNumber(dadosDimensionamento.potenciaRealKwp, 2)} kWp
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                    <span className="text-sm text-slate-400">Arranjo Fotovoltaico:</span>
                    <span className="text-sm font-semibold text-slate-200">
                      {dadosDimensionamento.qtdModulosReal}x Módulos {dadosDimensionamento.potenciaWpUnit}W
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                    <span className="text-sm text-slate-400">Inversor Recomendado:</span>
                    <span className="text-sm font-semibold text-yellow-400">
                      {dadosDimensionamento.inversorSugerido.nome}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                    <span className="text-sm text-slate-400">Autoconsumo Simultâneo:</span>
                    <span className="text-sm font-semibold text-emerald-400">
                      ~{Math.round(calculoFioB.energiaSimultaneaKwh)} kWh/mês ({calculoFioB.pctSimult}%)
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                    <span className="text-sm text-slate-400">Energia Injetada na Rede:</span>
                    <span className="text-sm font-semibold text-blue-400">
                      ~{Math.round(calculoFioB.energiaInjetadaKwh)} kWh/mês
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                    <span className="text-sm text-slate-400">Faturamento da Distribuidora:</span>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-white block">
                        {formatCurrency(calculoFioB.valorFaturadoConcessionaria)}/mês
                      </span>
                      <span className="text-[10px] text-yellow-400 font-semibold">
                        {calculoFioB.prevaleceFioB ? '(Prevalece Fio B)' : '(Prevalece Tarifa Mínima)'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-400">Economia Líquida Real:</span>
                    <div className="text-right">
                      <span className="text-base font-black text-emerald-400 block">
                        ~{formatCurrency(calculoFioB.economiaLiquidaMensal)}/mês
                      </span>
                      <span className="text-[11px] text-emerald-300 font-semibold">
                        ~{formatCurrency(calculoFioB.economiaLiquidaAnual)}/ano
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botão para avançar para Custos */}
                <button
                  type="button"
                  onClick={() => {
                    sincronizarModulosComDimensionamento()
                    setAbaAtiva('equipamentos')
                  }}
                  className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold rounded-2xl shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <span>Precificar Equipamentos & Materiais</span>
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Gráfico de Sazonalidade: Consumo vs Geração */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <TrendingUp size={16} className="text-yellow-400" />
                    Balanço Mensal: Consumo vs Geração (kWh)
                  </h4>
                </div>

                <div className="h-64 w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
                    <BarChart data={dadosDimensionamento.dadosGraficoMensal} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="mes" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                        formatter={(val) => [`${val} kWh`, '']}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                      <Bar dataKey="Consumo" fill="#64748b" radius={[4, 4, 0, 0]} name="Consumo" />
                      <Bar dataKey="Geracao" fill="#eab308" radius={[4, 4, 0, 0]} name="Geração Estimada" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* ABA 2: EQUIPAMENTOS CC (KIT VS AVULSO) */}
      {/* ============================================================= */}
      {abaAtiva === 'equipamentos' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Seletor de Modo: Kit Completo vs Item a Item */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Layers className="text-yellow-400" size={20} />
                Como você deseja informar os Equipamentos Fotovoltaicos?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Escolha se comprou um Kit Fotovoltaico Fechado de distribuidor ou se quer compor o custo item a item (módulos, inversores, estruturas, cabos CC).
              </p>
            </div>

            <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setModoEquipamento('kit')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  modoEquipamento === 'kit'
                    ? 'bg-yellow-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Kit Fotovoltaico Fechado
              </button>
              <button
                type="button"
                onClick={() => {
                  setModoEquipamento('avulso')
                  sincronizarModulosComDimensionamento()
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  modoEquipamento === 'avulso'
                    ? 'bg-yellow-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cotação Item a Item (Avulso)
              </button>
            </div>
          </div>

          {/* MODO 1: KIT FOTOVOLTAICO FECHADO */}
          {modoEquipamento === 'kit' ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></span>
                  <h4 className="font-bold text-white text-base">
                    Dados do Kit Fechado do Distribuidor
                  </h4>
                </div>
                <span className="text-xs text-yellow-400 font-semibold bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                  Potência Alvo: {formatNumber(dadosDimensionamento.potenciaRealKwp, 2)} kWp
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Distribuidor / Fornecedor
                  </label>
                  <input
                    type="text"
                    value={kitFechado.distribuidor}
                    onChange={(e) => setKitFechado({ ...kitFechado, distribuidor: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500"
                    placeholder="Ex: Aldo Solar, WEG, Solen..."
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Descrição do Kit Fotovoltaico
                  </label>
                  <input
                    type="text"
                    value={kitFechado.descricao}
                    onChange={(e) => setKitFechado({ ...kitFechado, descricao: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500"
                    placeholder="Módulos + Inversor + Estrutura + Cabos CC..."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Valor de Compra do Kit (R$)
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={kitFechado.valor}
                    onChange={(e) => setKitFechado({ ...kitFechado, valor: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-base font-extrabold text-yellow-400 focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Frete dos Equipamentos (R$)
                  </label>
                  <input
                    type="number"
                    step="50"
                    value={kitFechado.frete}
                    onChange={(e) => setKitFechado({ ...kitFechado, frete: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm font-semibold text-slate-200 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="md:col-span-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Subtotal dos Equipamentos (Kit + Frete):</span>
                    <span className="text-xl font-black text-white">
                      {formatCurrency(Number(kitFechado.valor) + Number(kitFechado.frete))}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Equivalente a {formatCurrency((Number(kitFechado.valor) + Number(kitFechado.frete)) / (dadosDimensionamento.potenciaRealKwp * 1000 || 1))}/Wp
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* MODO 2: COTAÇÃO ITEM A ITEM (AVULSO) */
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h4 className="font-bold text-white text-base">
                    Tabela de Equipamentos Avulsos (Módulos, Inversor, Estrutura, Cabos CC)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Altere os preços unitários, quantidades ou adicione novos componentes do lado de corrente contínua.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={sincronizarModulosComDimensionamento}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-yellow-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw size={14} />
                    Sincronizar Dimensionamento
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const novoItem = {
                        id: `eq_custom_${Date.now()}`,
                        nome: 'Novo Equipamento Fotovoltaico',
                        categoria: 'Personalizado',
                        qtd: 1,
                        valorUnit: 100,
                        custom: true
                      }
                      setEquipamentosAvulsos([...equipamentosAvulsos, novoItem])
                    }}
                    className="px-3.5 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Plus size={14} />
                    Adicionar Item
                  </button>
                </div>
              </div>

              {/* Tabela Interativa de Equipamentos */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Item / Equipamento</th>
                      <th className="py-3 px-3">Categoria</th>
                      <th className="py-3 px-3 text-center">Quantidade</th>
                      <th className="py-3 px-4 text-right">Valor Unitário (R$)</th>
                      <th className="py-3 px-4 text-right">Subtotal (R$)</th>
                      <th className="py-3 px-3 text-center">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {equipamentosAvulsos.map((item, index) => {
                      const subtotal = item.qtd * item.valorUnit
                      return (
                        <tr key={item.id} className="hover:bg-slate-850/40 transition-colors">
                          <td className="py-3 px-4 font-semibold text-white">
                            <input
                              type="text"
                              value={item.nome}
                              onChange={(e) => {
                                const novoNome = e.target.value
                                setEquipamentosAvulsos(prev =>
                                  prev.map(i => i.id === item.id ? { ...i, nome: novoNome } : i)
                                )
                              }}
                              className="bg-transparent border-b border-transparent focus:border-yellow-500 text-slate-100 text-sm w-full focus:outline-none"
                            />
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                              {item.categoria}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <input
                              type="number"
                              min="0"
                              value={item.qtd}
                              onChange={(e) => {
                                const novaQtd = Number(e.target.value) || 0
                                setEquipamentosAvulsos(prev =>
                                  prev.map(i => i.id === item.id ? { ...i, qtd: novaQtd } : i)
                                )
                              }}
                              className="w-16 text-center bg-slate-950 border border-slate-800 rounded-lg py-1 text-sm font-semibold text-white focus:outline-none focus:border-yellow-500"
                            />
                          </td>
                          <td className="py-3 px-4 text-right">
                            <input
                              type="number"
                              min="0"
                              step="5"
                              value={item.valorUnit}
                              onChange={(e) => {
                                const novoValor = Number(e.target.value) || 0
                                setEquipamentosAvulsos(prev =>
                                  prev.map(i => i.id === item.id ? { ...i, valorUnit: novoValor } : i)
                                )
                              }}
                              className="w-24 text-right bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-sm font-bold text-yellow-400 focus:outline-none focus:border-yellow-500"
                            />
                          </td>
                          <td className="py-3 px-4 text-right font-extrabold text-white">
                            {formatCurrency(subtotal)}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setEquipamentosAvulsos(prev => prev.filter(i => i.id !== item.id))
                              }}
                              className="p-1 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                              title="Remover Item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-700 bg-slate-950/60">
                      <td colSpan={4} className="py-3 px-4 font-bold text-slate-300 text-sm">
                        TOTAL DOS EQUIPAMENTOS AVULSOS (LADO CC):
                      </td>
                      <td className="py-3 px-4 text-right font-black text-yellow-400 text-base">
                        {formatCurrency(custosTotais.totalEquipamentos)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Botão de Próxima Aba */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setAbaAtiva('material_ca')}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold rounded-2xl shadow-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span>Avançar para Material Elétrico CA</span>
              <ChevronRight size={18} />
            </button>
          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* ABA 3: MATERIAL ELÉTRICO CA (CORRENTE ALTERNADA) */}
      {/* ============================================================= */}
      {abaAtiva === 'material_ca' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Seletor Kit vs Avulso do Material CA */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Zap className="text-yellow-400" size={20} />
                Material Elétrico CA (Corrente Alternada - QGBT / Proteção)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Cabos de alimentação CA, Disjuntores termomagnéticos, DPS CA, Quadros de sobrepor, Eletrodutos, abraçadeiras e fixadores.
              </p>
            </div>

            <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setModoMaterialCA('kit')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  modoMaterialCA === 'kit'
                    ? 'bg-yellow-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Kit Padrão CA Fechado
              </button>
              <button
                type="button"
                onClick={() => setModoMaterialCA('avulso')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  modoMaterialCA === 'avulso'
                    ? 'bg-yellow-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Itens CA Avulsos
              </button>
            </div>
          </div>

          {/* MODO 1: KIT CA FECHADO */}
          {modoMaterialCA === 'kit' ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></span>
                  <h4 className="font-bold text-white text-base">
                    Pacote Fechado de Material CA para o Sistema
                  </h4>
                </div>
                <span className="text-xs text-cyan-400 font-semibold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                  Prático & Rápido
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Título do Pacote CA
                  </label>
                  <input
                    type="text"
                    value={kitMaterialCA.nomePacote}
                    onChange={(e) => setKitMaterialCA({ ...kitMaterialCA, nomePacote: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Valor Estimado do Kit CA (R$)
                  </label>
                  <input
                    type="number"
                    step="50"
                    value={kitMaterialCA.valor}
                    onChange={(e) => setKitMaterialCA({ ...kitMaterialCA, valor: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-lg font-black text-yellow-400 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Subtotal Material CA:</span>
                    <span className="text-xl font-extrabold text-white">
                      {formatCurrency(kitMaterialCA.valor)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    ~{formatCurrency(kitMaterialCA.valor / (dadosDimensionamento.potenciaRealKwp * 1000 || 1))}/Wp
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Itens Inclusos no Pacote CA
                </label>
                <textarea
                  rows={3}
                  value={kitMaterialCA.descricao}
                  onChange={(e) => setKitMaterialCA({ ...kitMaterialCA, descricao: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>
          ) : (
            /* MODO 2: ITENS CA AVULSOS */
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h4 className="font-bold text-white text-base">
                    Lista Detalhada de Materiais Elétricos CA
                  </h4>
                  <p className="text-xs text-slate-400">
                    Ajuste bitola dos cabos, disjuntores, DPS, quadros e conexões item por item.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const novoItem = {
                      id: `ca_custom_${Date.now()}`,
                      nome: 'Novo Material Elétrico CA',
                      unidade: 'unidade',
                      qtd: 1,
                      valorUnit: 50,
                      detalhe: 'Especificação técnica'
                    }
                    setMateriaisCAAvulsos([...materiaisCAAvulsos, novoItem])
                  }}
                  className="px-3.5 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Plus size={14} />
                  Adicionar Item CA
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Item Elétrico CA</th>
                      <th className="py-3 px-3">Detalhe / Bitola</th>
                      <th className="py-3 px-3 text-center">Qtd / Unidade</th>
                      <th className="py-3 px-4 text-right">Valor Unitário (R$)</th>
                      <th className="py-3 px-4 text-right">Subtotal (R$)</th>
                      <th className="py-3 px-3 text-center">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {materiaisCAAvulsos.map((item) => {
                      const subtotal = item.qtd * item.valorUnit
                      return (
                        <tr key={item.id} className="hover:bg-slate-850/40 transition-colors">
                          <td className="py-3 px-4 font-semibold text-white">
                            <input
                              type="text"
                              value={item.nome}
                              onChange={(e) => {
                                const novoNome = e.target.value
                                setMateriaisCAAvulsos(prev =>
                                  prev.map(i => i.id === item.id ? { ...i, nome: novoNome } : i)
                                )
                              }}
                              className="bg-transparent border-b border-transparent focus:border-yellow-500 text-slate-100 text-sm w-full focus:outline-none"
                            />
                          </td>
                          <td className="py-3 px-3 text-xs text-slate-400">
                            <input
                              type="text"
                              value={item.detalhe}
                              onChange={(e) => {
                                const novoDetalhe = e.target.value
                                setMateriaisCAAvulsos(prev =>
                                  prev.map(i => i.id === item.id ? { ...i, detalhe: novoDetalhe } : i)
                                )
                              }}
                              className="bg-transparent border-b border-transparent focus:border-yellow-500 text-slate-400 text-xs w-full focus:outline-none"
                            />
                          </td>
                          <td className="py-3 px-3 text-center">
                            <input
                              type="number"
                              min="0"
                              value={item.qtd}
                              onChange={(e) => {
                                const novaQtd = Number(e.target.value) || 0
                                setMateriaisCAAvulsos(prev =>
                                  prev.map(i => i.id === item.id ? { ...i, qtd: novaQtd } : i)
                                )
                              }}
                              className="w-16 text-center bg-slate-950 border border-slate-800 rounded-lg py-1 text-sm font-semibold text-white focus:outline-none focus:border-yellow-500"
                            />
                          </td>
                          <td className="py-3 px-4 text-right">
                            <input
                              type="number"
                              min="0"
                              step="5"
                              value={item.valorUnit}
                              onChange={(e) => {
                                const novoValor = Number(e.target.value) || 0
                                setMateriaisCAAvulsos(prev =>
                                  prev.map(i => i.id === item.id ? { ...i, valorUnit: novoValor } : i)
                                )
                              }}
                              className="w-24 text-right bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-sm font-bold text-yellow-400 focus:outline-none focus:border-yellow-500"
                            />
                          </td>
                          <td className="py-3 px-4 text-right font-extrabold text-white">
                            {formatCurrency(subtotal)}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setMateriaisCAAvulsos(prev => prev.filter(i => i.id !== item.id))
                              }}
                              className="p-1 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                              title="Remover Item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-700 bg-slate-950/60">
                      <td colSpan={4} className="py-3 px-4 font-bold text-slate-300 text-sm">
                        TOTAL DO MATERIAL ELÉTRICO CA:
                      </td>
                      <td className="py-3 px-4 text-right font-black text-yellow-400 text-base">
                        {formatCurrency(custosTotais.totalMaterialCA)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Botão de Próxima Aba */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setAbaAtiva('instalacao_eng')}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold rounded-2xl shadow-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span>Avançar para Instalação & Engenharia</span>
              <ChevronRight size={18} />
            </button>
          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* ABA 4: INSTALAÇÃO & ENGENHARIA */}
      {/* ============================================================= */}
      {abaAtiva === 'instalacao_eng' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Card Mão de Obra de Instalação */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <Wrench className="text-yellow-400" size={20} />
                  Mão de Obra de Instalação
                </h3>
                <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-medium">
                  Equipe Técnica
                </span>
              </div>

              {/* Modo de Precificação da Instalação */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Modelo de Cálculo da Instalação
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'por_wp', label: 'Por Wp (R$/Wp)' },
                    { id: 'por_modulo', label: 'Por Painel (R$/mód)' },
                    { id: 'fixo', label: 'Valor Fixo (R$)' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setTipoCalculoInstalacao(m.id)
                        if (m.id === 'por_wp') setValorUnitInstalacao(0.55)
                        else if (m.id === 'por_modulo') setValorUnitInstalacao(140)
                        else setValorUnitInstalacao(3500)
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                        tipoCalculoInstalacao === m.id
                          ? 'bg-yellow-500 text-black shadow-md'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    {tipoCalculoInstalacao === 'por_wp'
                      ? 'Valor por Watt-pico (R$/Wp)'
                      : tipoCalculoInstalacao === 'por_modulo'
                      ? 'Valor por Módulo (R$)'
                      : 'Valor Fixo da Equipe (R$)'}
                  </label>
                  <input
                    type="number"
                    step={tipoCalculoInstalacao === 'por_wp' ? '0.05' : '10'}
                    value={valorUnitInstalacao}
                    onChange={(e) => setValorUnitInstalacao(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-base font-bold text-yellow-400 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Adicionais (Diárias/Altura)
                  </label>
                  <input
                    type="number"
                    step="50"
                    value={adicionaisInstalacao}
                    onChange={(e) => setAdicionaisInstalacao(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-200 focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Subtotal da Instalação:</span>
                  <span className="text-xl font-extrabold text-white">
                    {formatCurrency(custosTotais.totalInstalacao)}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  ~{formatCurrency(custosTotais.totalInstalacao / (dadosDimensionamento.potenciaRealKwp * 1000 || 1))}/Wp
                </span>
              </div>
            </div>

            {/* Card Engenharia, Legalização e Homologação */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <ShieldCheck className="text-yellow-400" size={20} />
                  Engenharia & Homologação
                </h3>
                <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-medium">
                  CREA / CFT / Concessionária
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-sm font-semibold text-white block">Projeto Elétrico & Diagrama Unifilar</span>
                    <span className="text-xs text-slate-500">Memorial descritivo e dimensionamento técnico</span>
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      step="50"
                      value={custosEngenharia.projetoEletrico}
                      onChange={(e) => setCustosEngenharia({ ...custosEngenharia, projetoEletrico: Number(e.target.value) || 0 })}
                      className="w-full text-right bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-sm font-bold text-yellow-400 focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-sm font-semibold text-white block">Emissão de ART (CREA) / TRT (CFT)</span>
                    <span className="text-xs text-slate-500">Responsabilidade Técnica do Engenheiro</span>
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      step="20"
                      value={custosEngenharia.artTrt}
                      onChange={(e) => setCustosEngenharia({ ...custosEngenharia, artTrt: Number(e.target.value) || 0 })}
                      className="w-full text-right bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-sm font-bold text-yellow-400 focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-sm font-semibold text-white block">Homologação na Concessionária</span>
                    <span className="text-xs text-slate-500">Protocolo, parecer de acesso e vistoria</span>
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      step="50"
                      value={custosEngenharia.homologacao}
                      onChange={(e) => setCustosEngenharia({ ...custosEngenharia, homologacao: Number(e.target.value) || 0 })}
                      className="w-full text-right bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-sm font-bold text-yellow-400 focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Subtotal Engenharia:</span>
                  <span className="text-xl font-extrabold text-white">
                    {formatCurrency(custosTotais.totalEngenharia)}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  Documentação 100% regularizada
                </span>
              </div>
            </div>

          </div>

          {/* Botão de Próxima Aba */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setAbaAtiva('precificacao')}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold rounded-2xl shadow-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span>Avançar para Formação do Preço & Markup</span>
              <ChevronRight size={18} />
            </button>
          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* ABA 5: MARGEM, MARKUP & PRECIFICAÇÃO */}
      {/* ============================================================= */}
      {abaAtiva === 'precificacao' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* COLUNA ESQUERDA: PARÂMETROS COMERCIAIS */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <Sliders className="text-yellow-400" size={20} />
                    Configuração Comercial & Margens
                  </h3>
                  <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full font-semibold">
                    Custo Base: {formatCurrency(custosTotais.custoDiretoTotal)}
                  </span>
                </div>

                {/* Seletor do Método de Precificação */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Método de Precificação
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTipoPrecificacao('por_dentro')}
                      className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                        tipoPrecificacao === 'por_dentro'
                          ? 'bg-yellow-500/10 border-yellow-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="font-bold text-sm block flex items-center gap-1.5">
                        <CheckCircle2 size={16} className={tipoPrecificacao === 'por_dentro' ? 'text-yellow-400' : 'text-slate-600'} />
                        Margem por Dentro (Markup Divisor)
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Recomendado contabilmente. O preço cobre impostos e comissões sobre a receita bruta.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTipoPrecificacao('multiplicador')}
                      className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                        tipoPrecificacao === 'multiplicador'
                          ? 'bg-yellow-500/10 border-yellow-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="font-bold text-sm block flex items-center gap-1.5">
                        <CheckCircle2 size={16} className={tipoPrecificacao === 'multiplicador' ? 'text-yellow-400' : 'text-slate-600'} />
                        Markup Multiplicador (Por Fora)
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Aplica a soma percentual diretamente sobre o custo direto dos equipamentos e obras.
                      </span>
                    </button>
                  </div>
                </div>

                {/* Sliders e Inputs de Percentuais */}
                <div className="space-y-5 pt-2">
                  
                  {/* Margem de Lucro Desejada */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <TrendingUp size={14} className="text-emerald-400" />
                        Margem de Contribuição / Lucro Desejado
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.5"
                          min="5"
                          max="50"
                          value={margemLucroDesejada}
                          onChange={(e) => setMargemLucroDesejada(Number(e.target.value) || 0)}
                          className="w-16 text-right bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-sm font-bold text-emerald-400 focus:outline-none focus:border-yellow-500"
                        />
                        <span className="text-xs text-slate-400 font-bold">%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      step="0.5"
                      value={margemLucroDesejada}
                      onChange={(e) => setMargemLucroDesejada(Number(e.target.value))}
                      className="w-full accent-emerald-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Impostos sobre a Venda */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Alíquota de Impostos (Simples Nacional / NF)
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="25"
                          value={aliquotaImposto}
                          onChange={(e) => setAliquotaImposto(Number(e.target.value) || 0)}
                          className="w-16 text-right bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-sm font-bold text-orange-400 focus:outline-none focus:border-yellow-500"
                        />
                        <span className="text-xs text-slate-400 font-bold">%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="18"
                      step="0.5"
                      value={aliquotaImposto}
                      onChange={(e) => setAliquotaImposto(Number(e.target.value))}
                      className="w-full accent-orange-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Comissão de Vendas */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Comissão do Consultor Comercial
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="15"
                          value={comissaoVendas}
                          onChange={(e) => setComissaoVendas(Number(e.target.value) || 0)}
                          className="w-16 text-right bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-sm font-bold text-blue-400 focus:outline-none focus:border-yellow-500"
                        />
                        <span className="text-xs text-slate-400 font-bold">%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={comissaoVendas}
                      onChange={(e) => setComissaoVendas(Number(e.target.value))}
                      className="w-full accent-blue-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Reserva Técnica / Contingência */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Reserva Técnica / Contingência de Obra
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="10"
                          value={reservaTecnica}
                          onChange={(e) => setReservaTecnica(Number(e.target.value) || 0)}
                          className="w-16 text-right bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-sm font-bold text-slate-200 focus:outline-none focus:border-yellow-500"
                        />
                        <span className="text-xs text-slate-400 font-bold">%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={reservaTecnica}
                      onChange={(e) => setReservaTecnica(Number(e.target.value))}
                      className="w-full accent-slate-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                </div>
              </div>

            </div>

            {/* COLUNA DIREITA: BREAKDOWN DO PREÇO & DRE RESUMIDA */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Card Destaque Preço e Benchmark */}
              <div className="bg-gradient-to-br from-yellow-500/15 via-slate-900 to-slate-950 border border-yellow-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-yellow-400">
                    Preço Final ao Cliente
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-yellow-500 text-black shadow-md">
                    Markup {formatNumber(formacaoPreco.markupMultiplicadorEfetivo, 2)}x
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    {formatCurrency(formacaoPreco.precoVenda)}
                  </span>
                </div>

                {/* Badge R$/Wp com benchmark */}
                <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Indicador de Mercado:</span>
                    <span className="text-lg font-black text-yellow-400">
                      {formatCurrency(formacaoPreco.precoPorWp)} / Wp
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      formacaoPreco.precoPorWp < 3.20
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : formacaoPreco.precoPorWp <= 3.90
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}>
                      {formacaoPreco.precoPorWp < 3.20 ? 'Preço Altamente Competitivo' : formacaoPreco.precoPorWp <= 3.90 ? 'Faixa Padrão de Mercado' : 'Margem Premium'}
                    </span>
                  </div>
                </div>

                {/* Linhas da Formação de Preço */}
                <div className="space-y-3 pt-2 text-sm border-t border-slate-800">
                  <div className="flex justify-between text-slate-300">
                    <span>Custo Direto Total (CPV):</span>
                    <span className="font-semibold text-white">{formatCurrency(custosTotais.custoDiretoTotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-xs">
                    <span>Impostos ({aliquotaImposto}%):</span>
                    <span className="font-medium text-orange-400">{formatCurrency(formacaoPreco.valorImposto)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-xs">
                    <span>Comissão de Vendas ({comissaoVendas}%):</span>
                    <span className="font-medium text-blue-400">{formatCurrency(formacaoPreco.valorComissao)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-xs">
                    <span>Contingência ({reservaTecnica}%):</span>
                    <span className="font-medium text-slate-300">{formatCurrency(formacaoPreco.valorContingencia)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold pt-2 border-t border-slate-800">
                    <span>Lucro Líquido Estimado:</span>
                    <span>{formatCurrency(formacaoPreco.lucroLiquido)} ({formatNumber(formacaoPreco.margemLiquidaReal, 1)}%)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAbaAtiva('resumo')}
                  className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer mt-4"
                >
                  <span>Ver DRE Sintética & Proposta Final</span>
                  <ChevronRight size={18} />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* ABA 6: DRE & PROPOSTA FINAL (RESUMO EXECUTIVO) */}
      {/* ============================================================= */}
      {abaAtiva === 'resumo' && (
        <div className="space-y-8 animate-fadeIn">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* DRE SINTÉTICA */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <FileText className="text-yellow-400" size={20} />
                  DRE Sintética do Projeto Solar
                </h3>
                <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-medium">
                  Demonstrativo Contábil
                </span>
              </div>

              <div className="space-y-3 font-mono text-sm">
                
                {/* 1. Receita Bruta */}
                <div className="p-3 bg-slate-950 rounded-xl flex justify-between items-center border-l-4 border-yellow-500">
                  <span className="font-bold text-white">(+) RECEITA BRUTA (PREÇO DE VENDA)</span>
                  <span className="font-black text-yellow-400 text-base">{formatCurrency(formacaoPreco.precoVenda)}</span>
                </div>

                {/* 2. Deduções de Impostos */}
                <div className="px-3 py-2 flex justify-between items-center text-slate-400">
                  <span>(-) Impostos sobre a Venda ({aliquotaImposto}%)</span>
                  <span className="text-red-400">-{formatCurrency(formacaoPreco.valorImposto)}</span>
                </div>

                {/* 3. Receita Líquida */}
                <div className="p-2.5 bg-slate-850/60 rounded-lg flex justify-between items-center text-slate-200 font-semibold">
                  <span>(=) RECEITA OPERACIONAL LÍQUIDA</span>
                  <span className="text-white">{formatCurrency(formacaoPreco.receitaLiquida)}</span>
                </div>

                {/* 4. Custos dos Equipamentos CC */}
                <div className="px-3 py-1.5 flex justify-between items-center text-slate-400 text-xs">
                  <span>(-) Equipamentos CC (Módulos, Inversor, Estrutura, Cabos)</span>
                  <span className="text-red-400">-{formatCurrency(custosTotais.totalEquipamentos)}</span>
                </div>

                {/* 5. Custo Material CA */}
                <div className="px-3 py-1.5 flex justify-between items-center text-slate-400 text-xs">
                  <span>(-) Material Elétrico CA (Cabos, Disjuntores, DPS, Quadro)</span>
                  <span className="text-red-400">-{formatCurrency(custosTotais.totalMaterialCA)}</span>
                </div>

                {/* 6. Mão de Obra */}
                <div className="px-3 py-1.5 flex justify-between items-center text-slate-400 text-xs">
                  <span>(-) Instalação Mecânica & Elétrica</span>
                  <span className="text-red-400">-{formatCurrency(custosTotais.totalInstalacao)}</span>
                </div>

                {/* 7. Engenharia */}
                <div className="px-3 py-1.5 flex justify-between items-center text-slate-400 text-xs">
                  <span>(-) Engenharia, ART/TRT & Homologação</span>
                  <span className="text-red-400">-{formatCurrency(custosTotais.totalEngenharia)}</span>
                </div>

                {/* 8. Lucro Bruto */}
                <div className="p-2.5 bg-slate-850/60 rounded-lg flex justify-between items-center text-slate-200 font-semibold">
                  <span>(=) LUCRO OPERACIONAL BRUTO</span>
                  <span className="text-white">{formatCurrency(formacaoPreco.lucroBruto)}</span>
                </div>

                {/* 9. Despesas Comerciais e Reserva */}
                <div className="px-3 py-1.5 flex justify-between items-center text-slate-400 text-xs">
                  <span>(-) Comissões Comerciais ({comissaoVendas}%)</span>
                  <span className="text-red-400">-{formatCurrency(formacaoPreco.valorComissao)}</span>
                </div>
                <div className="px-3 py-1.5 flex justify-between items-center text-slate-400 text-xs">
                  <span>(-) Reserva Técnica de Obra ({reservaTecnica}%)</span>
                  <span className="text-red-400">-{formatCurrency(formacaoPreco.valorContingencia)}</span>
                </div>

                {/* 10. Lucro Líquido Final */}
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex justify-between items-center">
                  <div>
                    <span className="font-extrabold text-emerald-400 block text-base">
                      (=) MARGEM DE CONTRIBUIÇÃO LÍQUIDA
                    </span>
                    <span className="text-xs text-emerald-300">
                      Retorno líquido da empresa após todas as despesas
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-400 block">
                      {formatCurrency(formacaoPreco.lucroLiquido)}
                    </span>
                    <span className="text-xs font-bold text-emerald-300">
                      {formatNumber(formacaoPreco.margemLiquidaReal, 1)}% do preço final
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* GRÁFICO DONUT DE COMPOSIÇÃO DOS CUSTOS & PREÇO */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <PieIcon className="text-yellow-400" size={18} />
                  Onde vai cada centavo do Preço de Venda
                </h4>

                <div className="h-64 w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
                    <PieChart>
                      <Pie
                        data={formacaoPreco.dadosDonut}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {formacaoPreco.dadosDonut.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                        formatter={(val) => [formatCurrency(val), '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                  {formacaoPreco.dadosDonut.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-400 truncate">{item.name}:</span>
                      <span className="text-slate-200 font-bold">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Resumo Financeiro & Lei 14.300 */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-white text-base flex items-center gap-2">
                    <Scale className="text-yellow-400" size={18} />
                    Retorno Real & Lei 14.300
                  </h4>
                  <span className="text-xs text-yellow-400 font-semibold bg-yellow-500/10 px-2.5 py-0.5 rounded-full border border-yellow-500/20">
                    {calculoFioB.prevaleceFioB ? 'Fio B Prevaleceu' : 'Tarifa Mínima Prevaleceu'}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Simultaneidade (Autoconsumo):</span>
                    <span className="font-bold text-emerald-400">{calculoFioB.pctSimult}% ({Math.round(calculoFioB.energiaSimultaneaKwh)} kWh/mês)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Energia Injetada na Rede:</span>
                    <span className="font-bold text-blue-400">{Math.round(calculoFioB.energiaInjetadaKwh)} kWh/mês</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Custo Faturado pela Concessionária:</span>
                    <span className="font-bold text-yellow-400">{formatCurrency(calculoFioB.valorFaturadoConcessionaria)}/mês</span>
                  </div>
                  <div className="flex justify-between text-slate-300 border-t border-slate-800 pt-2">
                    <span>Economia Líquida Mensal:</span>
                    <span className="font-black text-emerald-400 text-sm">{formatCurrency(calculoFioB.economiaLiquidaMensal)}/mês</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Economia Líquida Anual:</span>
                    <span className="font-bold text-emerald-300 text-sm">{formatCurrency(calculoFioB.economiaLiquidaAnual)}/ano</span>
                  </div>
                  <div className="flex justify-between text-slate-300 border-t border-slate-800 pt-2">
                    <span className="font-bold text-white">Payback Real do Investimento:</span>
                    <span className="font-black text-yellow-400 text-sm">{formatNumber(formacaoPreco.paybackAnos, 1)} anos</span>
                  </div>
                </div>
              </div>

              {/* Botão de Enviar ao Cliente */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h4 className="font-bold text-white text-base">
                  Pronto para Fechar com o Cliente?
                </h4>
                <p className="text-xs text-slate-400">
                  Copie o texto pronto com todos os dados técnicos e financeiros para envio via WhatsApp ou imprima a proposta preliminar.
                </p>

                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={handleCopiarWhatsapp}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Copy size={18} />
                    <span>Copiar Proposta Formatada (WhatsApp)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold rounded-2xl border border-slate-700 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <Printer size={18} />
                    <span>Imprimir Resumo da Simulação</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}
