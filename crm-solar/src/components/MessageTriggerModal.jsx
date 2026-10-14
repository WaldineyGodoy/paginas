import React, { useState, useEffect } from 'react'
import { X, Save, MessageSquare, Mail, Info, Clock, Zap } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function MessageTriggerModal({ isOpen, onClose, onSave, trigger }) {
  const { company } = useAuth()
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('rules') // rules, whatsapp, email
  const [formData, setFormData] = useState({
    name: '',
    entity_type: 'lead',
    trigger_status: '',
    trigger_event: 'Alteração de Status',
    logic_operator: 'and',
    channels: ['whatsapp'],
    message_template: '',
    delay_type: 'immediate',
    delay_days: 0,
    is_active: true
  })

  const entities = [
    { id: 'lead', label: 'Lead' },
    { id: 'subscriber', label: 'Assinante' },
    { id: 'consumer_unit', label: 'Unidade Consumidora' },
    { id: 'invoice', label: 'Fatura' },
    { id: 'power_plant', label: 'Usina' }
  ]

  const entityStatusOptions = {
    lead: [
      { id: 'novo', label: 'Novo Lead' },
      { id: 'contato', label: 'Em Contato' },
      { id: 'proposta', label: 'Proposta Enviada' },
      { id: 'ganho', label: 'Ganho / Contrato' }
    ],
    subscriber: [
      { id: 'ativacao', label: 'Ativação' },
      { id: 'ativo', label: 'Ativo' },
      { id: 'cancelado', label: 'Cancelado' }
    ],
    consumer_unit: [
      { id: 'em_ativacao', label: 'Em Ativação' },
      { id: 'ativo', label: 'Ativo' },
      { id: 'cancelado', label: 'Cancelado' }
    ],
    invoice: [
      { id: 'a_vencer', label: 'Pendente / A Vencer' },
      { id: 'pago', label: 'Paga' },
      { id: 'atrasado', label: 'Vencida' }
    ],
    power_plant: [
      { id: 'em_conexao', label: 'Em Conexão' },
      { id: 'gerando', label: 'Gerando' },
      { id: 'manutencao', label: 'Manutenção' }
    ]
  }

  const commonEvents = [
    'Criação de Registro',
    'Alteração de Status',
    'Documento Assinado',
    'Fatura Gerada',
    'Pagamento Confirmado',
    'Vencimento Próximo'
  ]

  const availableVariables = {
    lead: [
      { label: 'Nome do Lead', key: 'nome_lead' },
      { label: 'Email do Lead', key: 'email_lead' },
      { label: 'Telefone', key: 'telefone' }
    ],
    subscriber: [
      { label: 'Nome do Assinante', key: 'nome_assinante' },
      { label: 'Status', key: 'status_assinante' }
    ],
    consumer_unit: [
      { label: 'Código UC', key: 'codigo_uc' },
      { label: 'Concessionária', key: 'concessionaria' }
    ],
    invoice: [
      { label: 'Valor', key: 'valor_fatura' },
      { label: 'Vencimento', key: 'vencimento' }
    ],
    power_plant: [
      { label: 'Nome da Usina', key: 'nome_usina' }
    ]
  }

  useEffect(() => {
    if (trigger) {
      setFormData({
        name: trigger.name || '',
        entity_type: trigger.entity_type || 'lead',
        trigger_status: trigger.trigger_status || '',
        trigger_event: trigger.trigger_event || 'Alteração de Status',
        logic_operator: trigger.logic_operator || 'and',
        channels: trigger.channels || [trigger.channel || 'whatsapp'],
        message_template: trigger.message_template || '',
        delay_type: trigger.delay_type || 'immediate',
        delay_days: trigger.delay_days || 0,
        is_active: trigger.is_active !== false
      })
    } else {
      setFormData({
        name: '',
        entity_type: 'lead',
        trigger_status: '',
        trigger_event: 'Alteração de Status',
        logic_operator: 'and',
        channels: ['whatsapp'],
        message_template: '',
        delay_type: 'immediate',
        delay_days: 0,
        is_active: true
      })
    }
  }, [trigger, isOpen])

  const handleSave = async (e) => {
    e.preventDefault()
    if (!company?.id) return
    setLoading(true)

    try {
      const payload = {
        company_id: company.id,
        name: formData.name,
        entity_type: formData.entity_type,
        trigger_event: formData.trigger_event,
        trigger_status: formData.trigger_status,
        logic_operator: formData.logic_operator,
        channels: formData.channels,
        channel: formData.channels[0] || 'whatsapp',
        message_template: formData.message_template,
        delay_type: formData.delay_type,
        delay_days: formData.delay_days,
        is_active: formData.is_active
      }

      let error
      if (trigger?.id) {
        const { error: err } = await supabase
          .from('notification_triggers')
          .update(payload)
          .eq('id', trigger.id)
        error = err
      } else {
        const { error: err } = await supabase
          .from('notification_triggers')
          .insert([payload])
        error = err
      }

      if (error) throw error

      onSave()
      onClose()
    } catch (error) {
      alert('Erro ao salvar gatilho: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const insertVariable = (key) => {
    setFormData(prev => ({
      ...prev,
      message_template: prev.message_template + ` {{${key}}}`
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-850 flex justify-between items-center bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500/10 p-2.5 rounded-xl text-yellow-550">
              <Zap size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {trigger ? 'Editar Gatilho' : 'Novo Gatilho de Mensagem'}
              </h3>
              <p className="text-xs text-slate-400">Configure automações de envio baseadas em eventos.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 p-2 rounded-full transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-850 bg-slate-950/40">
          {[
            { id: 'rules', label: 'Regras de Disparo' },
            { id: 'message', label: 'Modelo de Mensagem' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-6 py-3.5 text-sm font-semibold transition-all border-b-2 ${
                activeSection === tab.id
                  ? 'border-yellow-500 text-yellow-550 bg-slate-900/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeSection === 'rules' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-1.5">
                  Nome do Gatilho
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Boas-vindas ao novo Lead"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-1.5">
                    Entidade Alvo
                  </label>
                  <select
                    value={formData.entity_type}
                    onChange={e => setFormData({ ...formData, entity_type: e.target.value, trigger_status: '' })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  >
                    {entities.map(e => <option key={e.id} value={e.id} className="bg-slate-950">{e.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-1.5">
                    Evento Disparador
                  </label>
                  <select
                    value={formData.trigger_event}
                    onChange={e => setFormData({ ...formData, trigger_event: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  >
                    {commonEvents.map(ev => <option key={ev} value={ev} className="bg-slate-950">{ev}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-1.5">
                    Status Requerido
                  </label>
                  <select
                    value={formData.trigger_status}
                    onChange={e => setFormData({ ...formData, trigger_status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  >
                    <option value="" className="bg-slate-950">Qualquer Status</option>
                    {entityStatusOptions[formData.entity_type]?.map(s => (
                      <option key={s.id} value={s.id} className="bg-slate-950">{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-1.5">
                    Canal de Disparo
                  </label>
                  <div className="flex gap-4 p-2 bg-slate-950 border border-slate-850 rounded-xl">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-350 hover:text-white px-2 py-1 text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={formData.channels.includes('whatsapp')}
                        onChange={() => {
                          const newCh = formData.channels.includes('whatsapp')
                            ? formData.channels.filter(c => c !== 'whatsapp')
                            : [...formData.channels, 'whatsapp']
                          setFormData({ ...formData, channels: newCh })
                        }}
                        className="rounded text-yellow-500 focus:ring-0 bg-slate-900 border-slate-800"
                      />
                      WhatsApp
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-350 hover:text-white px-2 py-1 text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={formData.channels.includes('email')}
                        onChange={() => {
                          const newCh = formData.channels.includes('email')
                            ? formData.channels.filter(c => c !== 'email')
                            : [...formData.channels, 'email']
                          setFormData({ ...formData, channels: newCh })
                        }}
                        className="rounded text-yellow-500 focus:ring-0 bg-slate-900 border-slate-800"
                      />
                      E-mail
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock size={16} className="text-yellow-550" />
                  Agendamento de Envio
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-1">
                      Tempo de Espera
                    </label>
                    <select
                      value={formData.delay_type}
                      onChange={e => setFormData({ ...formData, delay_type: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-white focus:outline-none"
                    >
                      <option value="immediate" className="bg-slate-950">Imediato (Sem Atraso)</option>
                      <option value="after_event" className="bg-slate-950">Dias após Evento</option>
                    </select>
                  </div>

                  {formData.delay_type !== 'immediate' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider mb-1">
                        Quantidade de Dias
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.delay_days}
                        onChange={e => setFormData({ ...formData, delay_days: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-white focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'message' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-450 uppercase tracking-wider">
                  Corpo do Modelo da Mensagem
                </label>
                <div className="text-slate-400 text-xs flex gap-1.5 items-center">
                  <Info size={14} />
                  Clique nas variáveis para inseri-las
                </div>
              </div>

              {/* Botões de Variáveis */}
              <div className="flex flex-wrap gap-2 p-3 bg-slate-950 border border-slate-850 rounded-xl">
                {availableVariables[formData.entity_type]?.map(v => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => insertVariable(v.key)}
                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-all border border-slate-800"
                  >
                    {`{{${v.label}}}`}
                  </button>
                ))}
              </div>

              <textarea
                required
                value={formData.message_template}
                onChange={e => setFormData({ ...formData, message_template: e.target.value })}
                placeholder="Escreva a mensagem aqui... Use {{variavel}} para dados dinâmicos."
                className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 min-h-[220px]"
              />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-yellow-550 bg-slate-950 border-slate-800 focus:ring-0"
                />
                <label htmlFor="is_active" className="text-sm text-slate-350 cursor-pointer font-medium">
                  Ativar gatilho imediatamente após salvar
                </label>
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-850">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-700 text-black rounded-xl font-bold transition-all flex items-center gap-2"
            >
              <Save size={16} />
              {loading ? 'Salvando...' : 'Salvar Gatilho'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
