import React, { useEffect, useState, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { 
  Bell, CreditCard, MessageSquare, Paintbrush, 
  FileSignature, Save, ShieldAlert, Zap, Search, 
  MapPin, Building2, Edit2, Plus, Trash2, Power, Clock,
  FileSpreadsheet
} from 'lucide-react'
import MessageTriggerModal from '../components/MessageTriggerModal'

const INITIAL_USINA_ITEMS = [
  { id: 1, descritivo: 'Assinatura do Contrato - Medição de Obras', etapas: 'Etapa 1', etapa: 'Contrato', diaAporte: 'DIA 1', qtd: 0, valorUnitario: 0, incluso: 'Não' },
  { id: 2, descritivo: 'Padrão de entrada Provisório Monofásico', etapas: 'Etapa 1', etapa: 'Obra Civil', diaAporte: 'DIA 5', qtd: 1, valorUnitario: 1500, incluso: 'Opcional' },
  { id: 3, descritivo: 'Consulta de Acesso', etapas: 'Etapa 1', etapa: 'Pré-contrato', diaAporte: 'DIA 1', qtd: 1, valorUnitario: 0, incluso: 'Não' },
  { id: 4, descritivo: 'Terreno', etapas: 'Etapa 1', etapa: 'Obra Civil', diaAporte: 'DIA 1', qtd: 1, valorUnitario: 0, incluso: 'Não' },
  { id: 5, descritivo: 'Terraplanagem', etapas: 'Etapa 1', etapa: 'Obra Civil', diaAporte: 'DIA 1', qtd: 1, valorUnitario: 8000, incluso: 'Sim' },
  { id: 6, descritivo: 'Camera de Segurança Wi-Fi Solar - 2 Lentes zoom 10x', etapas: 'Etapa 2', etapa: 'Equipamentos', diaAporte: 'DIA 5', qtd: 1, valorUnitario: 1200, incluso: 'Sim' },
  { id: 7, descritivo: 'Padrão de entrada e Mureta Trifásico 200A', etapas: 'Etapa 2', etapa: 'Obra Civil', diaAporte: 'DIA 5', qtd: 1, valorUnitario: 4500, incluso: 'Sim' },
  { id: 8, descritivo: 'Analise Performance - Pv System', etapas: 'Etapa 2', etapa: 'Projeto', diaAporte: 'DIA 1', qtd: 1, valorUnitario: 2500, incluso: 'Sim' },
  { id: 9, descritivo: 'Cerca - Tela Soldada - (m) Linear', etapas: 'Etapa 3', etapa: 'Obra Civil', diaAporte: 'DIA 30', qtd: 140, valorUnitario: 120, incluso: 'Sim' },
  { id: 10, descritivo: 'Caixa de Britas (Area em m2)', etapas: 'Etapa 3', etapa: 'Obra Civil', diaAporte: 'DIA 30', qtd: 50, valorUnitario: 60, incluso: 'Não' },
  { id: 11, descritivo: 'Abrigo Inversor', etapas: 'Etapa 3', etapa: 'Obra Civil', diaAporte: 'DIA 30', qtd: 1, valorUnitario: 3500, incluso: 'Sim' },
  { id: 12, descritivo: 'Sub-Estação + Poste + Projeto + Instalação', etapas: 'Etapa 3', etapa: 'Equipamentos', diaAporte: 'AG. CONSULTA', qtd: 1, valorUnitario: 45000, incluso: 'Opcional' },
  { id: 13, descritivo: 'Estrutura de Solo em aço - Linha Industrial', etapas: 'Etapa 3', etapa: 'Obra Civil', diaAporte: 'DIA 45', qtd: 144, valorUnitario: 180, incluso: 'Sim' },
  { id: 14, descritivo: 'Material Eletrico', etapas: 'Etapa 4', etapa: 'Material Eletrico - Insumos', diaAporte: 'DIA 30', qtd: 1, valorUnitario: 15000, incluso: 'Sim' },
  { id: 15, descritivo: 'Cabo Flex - Aluminio - Multiplexado 50mm', etapas: 'Etapa 4', etapa: 'Material Eletrico - Insumos', diaAporte: 'DIA 30', qtd: 25, valorUnitario: 85, incluso: 'Sim' },
  { id: 16, descritivo: 'Modulos Bifacial HJT 700w', etapas: 'Etapa 4', etapa: 'Equipamentos', diaAporte: 'DIA 60', qtd: 144, valorUnitario: 550, incluso: 'Sim' },
  { id: 17, descritivo: 'Cabos Solar', etapas: 'Etapa 4', etapa: 'Equipamentos', diaAporte: 'DIA 60', qtd: 720, valorUnitario: 8, incluso: 'Sim' },
  { id: 18, descritivo: 'Inversor 75 kw', etapas: 'Etapa 4', etapa: 'Equipamentos', diaAporte: 'DIA 60', qtd: 1, valorUnitario: 28000, incluso: 'Sim' },
  { id: 19, descritivo: 'StringBox Clamper 2E/2S - 1000V', etapas: 'Etapa 4', etapa: 'Equipamentos', diaAporte: 'DIA 60', qtd: 4, valorUnitario: 2200, incluso: 'Sim' },
  { id: 20, descritivo: 'Frete', etapas: 'Etapa 4', etapa: 'Transportes', diaAporte: 'DIA 30', qtd: 144, valorUnitario: 45, incluso: 'Sim' },
  { id: 21, descritivo: 'Instalação do Módulos', etapas: 'Etapa 5', etapa: 'Mão de obra', diaAporte: 'DIA 60', qtd: 144, valorUnitario: 150, incluso: 'Sim' },
  { id: 22, descritivo: 'Diarias', etapas: 'Etapa 5', etapa: 'Mão de obra', diaAporte: 'DIA 30', qtd: 14, valorUnitario: 250, incluso: 'Sim' },
  { id: 23, descritivo: 'Contrato Comercializadora', etapas: 'Etapa 5', etapa: 'Contrato', diaAporte: 'DIA 30', qtd: 1, valorUnitario: 5000, incluso: 'Sim' },
  { id: 24, descritivo: 'Constituição da SPE', etapas: 'Etapa 5', etapa: 'Contrato', diaAporte: 'DIA 15', qtd: 1, valorUnitario: 3000, incluso: 'Sim' },
  { id: 25, descritivo: 'Seguro Roubo - Incêndio - Danos (1 ano)', etapas: 'Etapa 5', etapa: 'Contrato', diaAporte: 'DIA 30', qtd: 1, valorUnitario: 4000, incluso: 'Sim' },
  { id: 26, descritivo: 'Monitoramento 24h - Segurança - (1 ano)', etapas: 'Etapa 5', etapa: 'O & M', diaAporte: 'DIA 30', qtd: 12, valorUnitario: 150, incluso: 'Sim' },
  { id: 27, descritivo: 'Monitoramento e 3 revisões - (1 ano)', etapas: 'Etapa 5', etapa: 'O & M', diaAporte: 'DIA 30', qtd: 12, valorUnitario: 300, incluso: 'Sim' },
  { id: 28, descritivo: 'Entrega do Obra - Medição de Obras', etapas: 'Etapa 5', etapa: 'Contrato', diaAporte: 'DIA 90', qtd: 1, valorUnitario: 0, incluso: 'Opcional' }
]

export default function ConfigAdmin() {
  const { company } = useAuth()
  const { theme, setTheme } = useTheme()
  
  // Tabs e UI
  const [activeTab, setActiveTab] = useState('padronizacao')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // 1. Padronização (Marca/Cores)
  const [displayName, setDisplayName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [primaryColorDark, setPrimaryColorDark] = useState('#eab308')
  const [primaryColorLight, setPrimaryColorLight] = useState('#ca8a04')
  const [secondaryColor, setSecondaryColor] = useState('#1e293b')
  const [backgroundColor, setBackgroundColor] = useState('#0f172a')

  // 2. Integração Financeira (Asaas)
  const [asaasKey, setAsaasKey] = useState('')
  const [asaasEnv, setAsaasEnv] = useState('sandbox')

  // 3. Conta de Energia (Concessionárias e Tarifas)
  const [concessionarias, setConcessionarias] = useState([])
  const [loadingCons, setLoadingCons] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterUF, setFilterUF] = useState('')
  const [filterCity, setFilterCity] = useState('')
  const [selectedCons, setSelectedCons] = useState(null)
  const [isConsModalOpen, setIsConsModalOpen] = useState(false)
  const [consModalData, setConsModalData] = useState({
    te: 0,
    tusd: 0,
    fio_b: 0,
    tarifa_concessionaria: 0,
    desconto_assinante: 0
  })

  // 4. Central de Notificações (Evolution API + Gatilhos)
  const [evoUrl, setEvoUrl] = useState('')
  const [evoKey, setEvoKey] = useState('')
  const [evoInstance, setEvoInstance] = useState('')
  const [notifLeads, setNotifLeads] = useState(true)
  const [notifPropostas, setNotifPropostas] = useState(true)
  const [triggers, setTriggers] = useState([])
  const [loadingTriggers, setLoadingTriggers] = useState(false)
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false)
  const [selectedTrigger, setSelectedTrigger] = useState(null)

  // 5. Assinatura Eletrônica
  const [eSigProvider, setESigProvider] = useState('docusign')
  const [eSigToken, setESigToken] = useState('')
  const [eSigAccountId, setESigAccountId] = useState('')

  // 6. Itens da Usina
  const [usinaItems, setUsinaItems] = useState(INITIAL_USINA_ITEMS)

  // Carregar dados iniciais do company_settings
  useEffect(() => {
    if (!company?.id) return

    async function loadSettings() {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .eq('company_id', company.id)
        .maybeSingle()

      if (data) {
        // Padronização
        setDisplayName(data.company_display_name || '')
        setLogoUrl(data.logo_url || '')
        setPrimaryColorDark(data.theme_colors?.primary_dark || data.theme_colors?.primary || '#eab308')
        setPrimaryColorLight(data.theme_colors?.primary_light || '#ca8a04')
        setSecondaryColor(data.theme_colors?.secondary || '#1e293b')
        setBackgroundColor(data.theme_colors?.background || '#0f172a')
        
        // Asaas
        setAsaasKey(data.asaas_api_key || '')
        setAsaasEnv(data.asaas_environment || 'sandbox')

        // Evolution
        setEvoUrl(data.evolution_api_url || '')
        setEvoKey(data.evolution_api_key || '')
        setEvoInstance(data.evolution_instance_name || '')

        // Notificações
        setNotifLeads(data.notification_settings?.leads ?? true)
        setNotifPropostas(data.notification_settings?.propostas ?? true)

        // Assinatura
        setESigProvider(data.e_signature_settings?.provider || 'docusign')
        setESigToken(data.e_signature_settings?.token || '')
        setESigAccountId(data.e_signature_settings?.account_id || '')

        // Itens da Usina
        if (data.usina_items && Array.isArray(data.usina_items)) {
          setUsinaItems(data.usina_items)
        } else {
          setUsinaItems(INITIAL_USINA_ITEMS)
        }
      }
    }

    loadSettings()
    fetchConcessionarias()
    fetchTriggers()
  }, [company])

  // Buscar Concessionárias
  const fetchConcessionarias = async () => {
    setLoadingCons(true)
    try {
      const { data, error } = await supabase
        .from('view_concessionarias_resumo')
        .select('*')
        .order('Concessionaria', { ascending: true })

      if (error) throw error
      
      const mapped = data.map(item => ({
        ...item,
        Municipios: item.Municipios_str ? item.Municipios_str.toLowerCase().split(', ') : []
      }))

      setConcessionarias(mapped)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingCons(false)
    }
  }

  // Buscar Gatilhos
  const fetchTriggers = async () => {
    if (!company?.id) return
    setLoadingTriggers(true)
    try {
      const { data, error } = await supabase
        .from('notification_triggers')
        .select('*')
        .eq('company_id', company.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTriggers(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingTriggers(false)
    }
  }

  // Filtrar Concessionárias
  const filteredCons = useMemo(() => {
    return concessionarias.filter(c => {
      const matchCons = !searchTerm || c.Concessionaria?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchUF = !filterUF || c.UF?.toLowerCase().includes(filterUF.toLowerCase())
      const matchCity = !filterCity || c.Municipios?.some(m => m.includes(filterCity.toLowerCase()))
      return matchCons && matchUF && matchCity
    })
  }, [concessionarias, searchTerm, filterUF, filterCity])

  // Salvar Configurações Gerais
  const handleSaveSettings = async (e) => {
    e.preventDefault()
    if (!company?.id) return
    setLoading(true)
    setMessage('')
    setErrorMsg('')

    try {
      const { error } = await supabase
        .from('company_settings')
        .upsert({
          company_id: company.id,
          asaas_api_key: asaasKey,
          asaas_environment: asaasEnv,
          evolution_api_url: evoUrl,
          evolution_api_key: evoKey,
          evolution_instance_name: evoInstance,
          theme_colors: { 
            primary_dark: primaryColorDark, 
            primary_light: primaryColorLight, 
            secondary: secondaryColor, 
            background: backgroundColor 
          },
          company_display_name: displayName,
          logo_url: logoUrl,
          notification_settings: { leads: notifLeads, propostas: notifPropostas },
          e_signature_settings: { provider: eSigProvider, token: eSigToken, account_id: eSigAccountId },
          usina_items: usinaItems
        })

      if (error) throw error

      setTheme({
        primaryDark: primaryColorDark,
        primaryLight: primaryColorLight,
        secondary: secondaryColor,
        background: backgroundColor,
        companyDisplayName: displayName || company.name,
        logoUrl: logoUrl,
        mode: theme.mode
      })

      setMessage('Configurações gerais salvas com sucesso!')
    } catch (err) {
      setErrorMsg(`Erro ao salvar: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Abrir Modal de Edição de Tarifas
  const openEditCons = (cons) => {
    setSelectedCons(cons)
    setConsModalData({
      te: Number(cons.TE || 0),
      tusd: Number(cons.TUSD || 0),
      fio_b: Number(cons["Fio B"] || 0),
      tarifa_concessionaria: Number(cons["Tarifa Concessionaria"] || 0),
      desconto_assinante: Number(cons["Desconto Assinante"] || 0)
    })
    setIsConsModalOpen(true)
  }

  // Atualizar Tarifas da Concessionária
  const handleSaveTariffs = async (e) => {
    e.preventDefault()
    if (!selectedCons) return
    setLoading(true)

    try {
      const { error } = await supabase
        .from('Concessionaria')
        .update({
          "TE": consModalData.te,
          "TUSD": consModalData.tusd,
          "Fio B": consModalData.fio_b,
          "Tarifa Concessionaria": consModalData.te + consModalData.tusd,
          "Desconto Assinante": consModalData.desconto_assinante
        })
        .eq('Concessionaria', selectedCons.Concessionaria)
        .eq('UF', selectedCons.UF)

      if (error) throw error

      setIsConsModalOpen(false)
      fetchConcessionarias()
      setMessage('Tarifas da concessionária salvas com sucesso!')
    } catch (err) {
      alert('Erro ao atualizar tarifas: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Deletar Gatilho
  const handleDeleteTrigger = async (id) => {
    if (!confirm('Deseja excluir este gatilho?')) return
    try {
      const { error } = await supabase
        .from('notification_triggers')
        .delete()
        .eq('id', id)
      if (error) throw error
      fetchTriggers()
    } catch (err) {
      alert(err.message)
    }
  }

  // Alterar Status do Gatilho (Ativar/Desativar)
  const handleToggleTrigger = async (trigger) => {
    try {
      const { error } = await supabase
        .from('notification_triggers')
        .update({ is_active: !trigger.is_active })
        .eq('id', trigger.id)
      if (error) throw error
      fetchTriggers()
    } catch (err) {
      alert(err.message)
    }
  }

  // Manipular Itens da Usina
  const handleUsinaItemChange = (id, field, value) => {
    setUsinaItems(prev => prev.map(item => {
      if (item.id === id) {
        let val = value
        if (field === 'qtd' || field === 'valorUnitario') {
          val = Number(value) || 0
        }
        return { ...item, [field]: val }
      }
      return item
    }))
  }

  const tabs = [
    { id: 'padronizacao', name: 'Padronização', icon: Paintbrush },
    { id: 'financeiro', name: 'Integração Financeira', icon: CreditCard },
    { id: 'energia', name: 'Conta de Energia', icon: Building2 },
    { id: 'itens_usina', name: 'Itens da Usina', icon: FileSpreadsheet },
    { id: 'notificacoes', name: 'Central de Notificações', icon: Bell },
    { id: 'assinatura', name: 'Assinatura Eletrônica', icon: FileSignature }
  ]

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Configurações do CRM</h1>
        <p className="text-slate-400 text-sm mt-1">
          Gerencie a identidade visual de sua marca, integrações, centrais de mensagens e faturamento.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar de Abas */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-3xl backdrop-blur-md flex flex-col gap-2 h-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-550/15'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon size={18} />
                {tab.name}
              </button>
            )
          })}
        </div>

        {/* Formulário Principal */}
        <div className="lg:col-span-3 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md relative flex flex-col justify-between">
          <div>
            {message && (
              <div className="mb-6 bg-slate-950 border border-yellow-500/20 text-yellow-400 px-4 py-3 rounded-2xl flex items-center gap-2.5 text-sm">
                <Zap size={18} className="shrink-0 text-yellow-500" />
                <span>{message}</span>
              </div>
            )}
            {errorMsg && (
              <div className="mb-6 bg-red-950/20 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl flex items-center gap-2.5 text-sm">
                <ShieldAlert size={18} className="shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* ABA 1: PADRONIZAÇÃO */}
              {activeTab === 'padronizacao' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Identidade Visual e Marca</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-2">
                        Nome da Empresa
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder={company?.name || 'CRM Solar'}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-2">
                        URL do Logotipo
                      </label>
                      <input
                        type="text"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://suaempresa.com/logo.png"
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pt-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-2">
                        Primária (Dark)
                      </label>
                      <div className="flex items-center gap-3 bg-slate-950 border border-slate-850 p-2 rounded-xl">
                        <input
                          type="color"
                          value={primaryColorDark}
                          onChange={(e) => setPrimaryColorDark(e.target.value)}
                          className="w-10 h-9 rounded cursor-pointer border-none bg-transparent"
                        />
                        <span className="text-sm font-mono text-slate-350">{primaryColorDark}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-2">
                        Primária (Light)
                      </label>
                      <div className="flex items-center gap-3 bg-slate-950 border border-slate-850 p-2 rounded-xl">
                        <input
                          type="color"
                          value={primaryColorLight}
                          onChange={(e) => setPrimaryColorLight(e.target.value)}
                          className="w-10 h-9 rounded cursor-pointer border-none bg-transparent"
                        />
                        <span className="text-sm font-mono text-slate-350">{primaryColorLight}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-2">
                        Cor Secundária
                      </label>
                      <div className="flex items-center gap-3 bg-slate-950 border border-slate-850 p-2 rounded-xl">
                        <input
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-10 h-9 rounded cursor-pointer border-none bg-transparent"
                        />
                        <span className="text-sm font-mono text-slate-350">{secondaryColor}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-2">
                        Cor de Fundo
                      </label>
                      <div className="flex items-center gap-3 bg-slate-950 border border-slate-850 p-2 rounded-xl">
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-10 h-9 rounded cursor-pointer border-none bg-transparent"
                        />
                        <span className="text-sm font-mono text-slate-350">{backgroundColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 2: INTEGRAÇÃO FINANCEIRA */}
              {activeTab === 'financeiro' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Integração Asaas (Faturamento)</h3>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-455 uppercase tracking-wider mb-2">
                      Token de Produção/Sandbox
                    </label>
                    <input
                      type="password"
                      value={asaasKey}
                      onChange={(e) => setAsaasKey(e.target.value)}
                      placeholder="asaas_api_key_token"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-455 uppercase tracking-wider mb-2">
                      Ambiente
                    </label>
                    <select
                      value={asaasEnv}
                      onChange={(e) => setAsaasEnv(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                    >
                      <option value="sandbox" className="bg-slate-950">Homologação (Sandbox)</option>
                      <option value="production" className="bg-slate-950">Produção (Real)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ABA 3: CONTA DE ENERGIA */}
              {activeTab === 'energia' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h3 className="text-lg font-bold text-white">Tarifas de Distribuidoras</h3>
                  </div>

                  {/* Filtros */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/60 p-4 border border-slate-850 rounded-2xl">
                    <div className="relative">
                      <Search size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Distribuidora..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none"
                      />
                    </div>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Cidade/Município..."
                        value={filterCity}
                        onChange={(e) => setFilterCity(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none"
                      />
                    </div>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Estado (UF)..."
                        value={filterUF}
                        onChange={(e) => setFilterUF(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Grid de concessionárias */}
                  {loadingCons ? (
                    <div className="text-center py-8 text-slate-400">Carregando concessionárias...</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2">
                      {filteredCons.map((cons, idx) => (
                        <div key={idx} className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between hover:border-yellow-500/30 transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-white">{cons.Concessionaria}</h4>
                              <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={12} /> {cons.UF}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => openEditCons(cons)}
                              className="text-slate-400 hover:text-yellow-500 p-1.5 rounded-lg bg-slate-900 border border-slate-800"
                            >
                              <Edit2 size={14} />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-900 text-xs">
                            <div className="bg-slate-900/50 p-2 rounded-lg">
                              <span className="text-slate-500 block uppercase font-semibold">Tarifa Final</span>
                              <span className="text-white font-bold">R$ {Number(cons.TE + cons.TUSD).toFixed(4)}</span>
                            </div>
                            <div className="bg-slate-900/50 p-2 rounded-lg">
                              <span className="text-slate-500 block uppercase font-semibold">Desconto</span>
                              <span className="text-yellow-500 font-bold">{cons["Desconto Assinante"]}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ABA 4: CENTRAL DE NOTIFICAÇÕES */}
              {activeTab === 'notificacoes' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Central de Notificações</h3>

                  {/* Integração WhatsApp */}
                  <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <MessageSquare size={16} className="text-yellow-550" />
                      Configurações da Evolution API (WhatsApp/Voz)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 font-medium mb-1">URL Base do Servidor</label>
                        <input
                          type="text"
                          value={evoUrl}
                          onChange={e => setEvoUrl(e.target.value)}
                          placeholder="https://api.seushospedagem.com"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 font-medium mb-1">Instância</label>
                        <input
                          type="text"
                          value={evoInstance}
                          onChange={e => setEvoInstance(e.target.value)}
                          placeholder="minha_instancia"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 font-medium mb-1">API Key da Evolution</label>
                      <input
                        type="password"
                        value={evoKey}
                        onChange={e => setEvoKey(e.target.value)}
                        placeholder="Chave secreta"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Configurações de Gatilhos */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Zap size={16} className="text-yellow-550" />
                        Gatilhos de Notificação Ativos
                      </h4>
                      <button
                        type="button"
                        onClick={() => { setSelectedTrigger(null); setIsTriggerModalOpen(true); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-xs rounded-lg transition-all"
                      >
                        <Plus size={14} /> Novo Gatilho
                      </button>
                    </div>

                    {loadingTriggers ? (
                      <div className="text-center py-6 text-slate-450">Buscando regras...</div>
                    ) : (
                      <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-2">
                        {triggers.length === 0 ? (
                          <div className="text-center py-6 text-slate-500 text-sm border border-dashed border-slate-800 rounded-2xl">
                            Nenhum gatilho de disparo configurado.
                          </div>
                        ) : (
                          triggers.map((trig) => (
                            <div key={trig.id} className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
                              <div>
                                <h5 className="font-bold text-white text-sm">{trig.name}</h5>
                                <div className="flex gap-2 text-xs text-slate-400 mt-1 items-center">
                                  <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 uppercase font-semibold text-[10px] text-yellow-550">{trig.entity_type}</span>
                                  <span>•</span>
                                  <span>{trig.trigger_event}</span>
                                  {trig.delay_days > 0 && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center gap-1"><Clock size={12} /> {trig.delay_days} dias</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => handleToggleTrigger(trig)}
                                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                                    trig.is_active 
                                      ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                                      : 'bg-slate-900 border-slate-800 text-slate-400'
                                  }`}
                                >
                                  <Power size={12} />
                                  {trig.is_active ? 'ATIVO' : 'PAUSADO'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => { setSelectedTrigger(trig); setIsTriggerModalOpen(true); }}
                                  className="text-slate-400 hover:text-white p-1"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTrigger(trig.id)}
                                  className="text-slate-450 hover:text-red-400 p-1"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ABA: ITENS DA USINA (VALORES PADRÃO) */}
              {activeTab === 'itens_usina' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">Valores Padrão - Itens da Usina</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Configure os itens que serão preenchidos por padrão no simulador dos usuários.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-800 max-h-[400px] overflow-y-auto pr-1">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-950 text-slate-350 border-b border-slate-800 font-semibold">
                          <th className="p-4">Descritivo</th>
                          <th className="p-4">Etapa</th>
                          <th className="p-4">Aporte</th>
                          <th className="p-4 text-center">Qtd Padrão</th>
                          <th className="p-4">Unitário Padrão</th>
                          <th className="p-4 text-center">Incluso</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850 bg-slate-900/30">
                        {usinaItems.map(item => (
                          <tr key={item.id} className="hover:bg-slate-950/40 transition-colors">
                            <td className="p-4 font-medium text-white max-w-xs truncate" title={item.descritivo}>
                              {item.descritivo}
                            </td>
                            <td className="p-4 text-slate-450 whitespace-nowrap text-xs">{item.etapa}</td>
                            <td className="p-4 text-slate-450 whitespace-nowrap text-xs">{item.diaAporte}</td>
                            <td className="p-4 text-center">
                              <input
                                type="number"
                                value={item.qtd}
                                min="0"
                                onChange={(e) => handleUsinaItemChange(item.id, 'qtd', e.target.value)}
                                className="w-16 bg-slate-950 border border-slate-800 rounded-lg py-1 px-2 text-center text-white focus:outline-none focus:border-yellow-500"
                              />
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                <span className="text-slate-500 text-xs">R$</span>
                                <input
                                  type="number"
                                  value={item.valorUnitario}
                                  min="0"
                                  onChange={(e) => handleUsinaItemChange(item.id, 'valorUnitario', e.target.value)}
                                  className="w-24 bg-slate-950 border border-slate-800 rounded-lg py-1 px-2 text-white focus:outline-none focus:border-yellow-500"
                                />
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <select
                                value={item.incluso}
                                onChange={(e) => handleUsinaItemChange(item.id, 'incluso', e.target.value)}
                                className="bg-slate-950 border border-slate-800 rounded-lg py-1 px-2 text-xs text-white focus:outline-none focus:border-yellow-500 cursor-pointer"
                              >
                                <option value="Sim">Sim</option>
                                <option value="Opcional">Opcional</option>
                                <option value="Não">Não</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ABA 5: ASSINATURA ELETRÔNICA */}
              {activeTab === 'assinatura' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Assinatura Eletrônica (Contratos)</h3>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-2">
                      Provedor Integrado
                    </label>
                    <select
                      value={eSigProvider}
                      onChange={(e) => setESigProvider(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                    >
                      <option value="docusign" className="bg-slate-950">DocuSign</option>
                      <option value="clicksign" className="bg-slate-950">Clicksign</option>
                      <option value="zapsign" className="bg-slate-950">ZapSign</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-2">
                        Token de Autenticação / API Key
                      </label>
                      <input
                        type="password"
                        value={eSigToken}
                        onChange={(e) => setESigToken(e.target.value)}
                        placeholder="Chave de Acesso"
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-2">
                        ID da Conta (Opcional)
                      </label>
                      <input
                        type="text"
                        value={eSigAccountId}
                        onChange={(e) => setESigAccountId(e.target.value)}
                        placeholder="Account ID"
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Botão de Salvar Alterações Gerais */}
              {activeTab !== 'energia' && (
                <div className="flex justify-end pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-700 text-black font-semibold rounded-xl shadow-lg shadow-yellow-550/10 transition-all active:scale-95"
                  >
                    <Save size={18} />
                    {loading ? 'Salvando...' : 'Salvar Configurações'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Modal de Concessionárias / Tarifas */}
      {isConsModalOpen && selectedCons && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-white mb-2">{selectedCons.Concessionaria}</h3>
            <p className="text-xs text-slate-400 mb-6">Ajuste de tarifas de energia e desconto padrão para UF: {selectedCons.UF}</p>

            <form onSubmit={handleSaveTariffs} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Tarifa de Energia (TE)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={consModalData.te}
                    onChange={e => setConsModalData({ ...consModalData, te: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Tarifa Distribuição (TUSD)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={consModalData.tusd}
                    onChange={e => setConsModalData({ ...consModalData, tusd: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Fio B</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={consModalData.fio_b}
                    onChange={e => setConsModalData({ ...consModalData, fio_b: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 font-semibold mb-1">Tarifa Final (TE + TUSD)</label>
                  <input
                    type="text"
                    disabled
                    value={`R$ ${(consModalData.te + consModalData.tusd).toFixed(4)}`}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 text-sm font-bold"
                  />
                </div>
              </div>

              <div className="bg-yellow-500/5 border border-yellow-500/10 p-4 rounded-2xl">
                <label className="block text-xs text-yellow-500 font-bold mb-1">Desconto Padrão ao Assinante (%)</label>
                <input
                  type="number"
                  value={consModalData.desconto_assinante}
                  onChange={e => setConsModalData({ ...consModalData, desconto_assinante: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-yellow-500/20 rounded-xl px-3 py-2 text-yellow-500 text-sm font-bold mt-1.5 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setIsConsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-xl text-sm"
                >
                  {loading ? 'Salvando...' : 'Salvar Tarifas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Gatilhos de Notificação */}
      <MessageTriggerModal
        isOpen={isTriggerModalOpen}
        onClose={() => setIsTriggerModalOpen(false)}
        onSave={fetchTriggers}
        trigger={selectedTrigger}
      />
    </div>
  )
}
