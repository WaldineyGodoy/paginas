import React, { useState } from 'react'
import { ShieldCheck, Users, Package, AlertOctagon, Plus, Edit } from 'lucide-react'

export default function ConfigSuperadmin() {
  const [planos, setPlanos] = useState([
    { id: 1, name: 'Plano Solar Start', valor: 'R$ 299/mês', limiteUsuarios: 3, moduloAssinatura: false },
    { id: 2, name: 'Plano Solar Pro', valor: 'R$ 599/mês', limiteUsuarios: 10, moduloAssinatura: true },
    { id: 3, name: 'Plano Solar Enterprise', valor: 'R$ 1.299/mês', limiteUsuarios: 'Ilimitado', moduloAssinatura: true }
  ])

  const [clientes, setClientes] = useState([
    { id: 1, empresa: 'B2W Soluções', plano: 'Plano Solar Pro', status: 'ativo', inadimplente: false },
    { id: 2, empresa: 'Camaçari Solar', plano: 'Plano Solar Start', status: 'ativo', inadimplente: true },
    { id: 3, empresa: 'Nordeste Energia', plano: 'Plano Solar Enterprise', status: 'suspenso', inadimplente: false }
  ])

  const handleAddPlano = () => {
    alert('Adicionar Novo Plano (Simulado)')
  }

  const toggleInadimplencia = (id) => {
    setClientes(prev => prev.map(c => c.id === id ? { ...c, inadimplente: !c.inadimplente } : c))
  }

  return (
    <div className="p-6 text-slate-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldCheck className="text-yellow-500" size={32} />
          Painel Global (Superadmin)
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Controle central do SAAS CRM Solar. Gerencie planos e acompanhe inadimplências.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Gestão de Planos do SAAS */}
        <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Package className="text-yellow-500" size={20} />
              Planos do Sistema
            </h2>
            <button onClick={handleAddPlano} className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded-xl text-black">
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-4">
            {planos.map((p) => (
              <div key={p.id} className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-sm">{p.name}</h4>
                  <span className="text-xs font-semibold text-yellow-400">{p.valor}</span>
                </div>
                <div className="text-xs text-slate-455 flex flex-col gap-1">
                  <span>Limite de Usuários: <strong>{p.limiteUsuarios}</strong></span>
                  <span>Assinatura Digital: <strong>{p.moduloAssinatura ? 'Sim' : 'Não'}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gerenciamento de Clientes (Inquilinos/Tenants) */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Users className="text-yellow-500" size={20} />
            Clientes Cadastrados (Inquilinos)
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Empresa</th>
                  <th className="pb-3">Plano</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Inadimplência</th>
                  <th className="pb-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-sm">
                {clientes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-850/20">
                    <td className="py-4 font-semibold text-white">{c.empresa}</td>
                    <td className="py-4 text-slate-300">{c.plano}</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'ativo' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => toggleInadimplencia(c.id)}
                        className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          c.inadimplente ? 'bg-red-550/20 text-red-450 border border-red-500/30' : 'bg-green-550/10 text-green-450'
                        }`}
                      >
                        <AlertOctagon size={12} />
                        {c.inadimplente ? 'Atrasado' : 'Em Dia'}
                      </button>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-slate-400 hover:text-white p-1">
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
