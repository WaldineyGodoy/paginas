import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import KanbanListView from '../components/KanbanListView'
import { Star, Phone, Mail, Calendar, Trash2 } from 'lucide-react'

const COLUMNS = [
  { id: 'novo', name: 'Novo Lead', color: '#3b82f6' },
  { id: 'contato', name: 'Em Contato', color: '#eab308' },
  { id: 'proposta', name: 'Proposta Enviada', color: '#a855f7' },
  { id: 'ganho', name: 'Ganho / Contrato', color: '#22c55e' }
]

export default function Leads() {
  const { company, profile } = useAuth()
  const [leads, setLeads] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  
  // Campos do formulário
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('novo')

  const fetchLeads = async () => {
    if (!company?.id) return
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('company_id', company.id)
      .order('created_at', { ascending: false })

    if (data) setLeads(data)
  }

  useEffect(() => {
    fetchLeads()
  }, [company])

  const handleAddLead = async (e) => {
    e.preventDefault()
    if (!company?.id) return

    const { error } = await supabase
      .from('leads')
      .insert([{
        company_id: company.id,
        name,
        email,
        phone,
        status,
        created_by: profile?.id
      }])

    if (!error) {
      setShowAddModal(false)
      setName('')
      setEmail('')
      setPhone('')
      setStatus('novo')
      fetchLeads()
    } else {
      alert(error.message)
    }
  }

  const handleDeleteLead = async (id) => {
    if (confirm('Tem certeza que deseja excluir este Lead?')) {
      const { error } = await supabase.from('leads').delete().eq('id', id)
      if (!error) fetchLeads()
    }
  }

  // Renderizadores Customizados
  const renderLeadCard = (lead) => (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md hover:border-slate-700 transition-all flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-white text-sm">{lead.name}</h4>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDeleteLead(lead.id)
          }}
          className="text-slate-500 hover:text-red-400 p-1 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="text-xs text-slate-400 flex flex-col gap-1">
        {lead.phone && <span className="flex items-center gap-1.5"><Phone size={12} /> {lead.phone}</span>}
        {lead.email && <span className="flex items-center gap-1.5"><Mail size={12} /> {lead.email}</span>}
        <span className="flex items-center gap-1.5 text-slate-500 mt-1">
          <Calendar size={12} /> {new Date(lead.created_at).toLocaleDateString('pt-BR')}
        </span>
      </div>
    </div>
  )

  const renderLeadRow = (lead, onClick) => (
    <tr key={lead.id} className="hover:bg-slate-850/40 transition-colors cursor-pointer" onClick={() => onClick?.(lead)}>
      <td className="p-4 font-semibold text-white text-sm">{lead.name}</td>
      <td className="p-4 text-slate-300 text-sm">{lead.email || '-'}</td>
      <td className="p-4 text-slate-300 text-sm">{lead.phone || '-'}</td>
      <td className="p-4 text-sm">
        <span
          className="px-2 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: COLUMNS.find(c => c.id === lead.status)?.color + '20',
            color: COLUMNS.find(c => c.id === lead.status)?.color
          }}
        >
          {COLUMNS.find(c => c.id === lead.status)?.name}
        </span>
      </td>
      <td className="p-4 text-right">
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDeleteLead(lead.id)
          }}
          className="text-slate-500 hover:text-red-400 p-2 rounded-lg"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  )

  return (
    <div>
      <KanbanListView
        title="Gestão de Leads"
        data={leads}
        columns={COLUMNS}
        onAddClick={() => setShowAddModal(true)}
        renderCard={renderLeadCard}
        renderRow={renderLeadRow}
        headers={['Nome', 'E-mail', 'Telefone', 'Status']}
      />

      {/* Modal de Cadastro */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-white mb-6">Criar Novo Lead</h3>
            
            <form onSubmit={handleAddLead} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do Lead"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  WhatsApp / Telefone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(71) 99999-9999"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Status Inicial
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                >
                  {COLUMNS.map(col => (
                    <option key={col.id} value={col.id} className="bg-slate-950">{col.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl font-semibold transition-all"
                >
                  Salvar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
