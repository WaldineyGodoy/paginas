import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Sun, Mail, Lock, ShieldAlert, Zap } from 'lucide-react'

export default function Login() {
  const { loginDemo } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOnboarding, setIsOnboarding] = useState(false)
  
  // Dados de Onboarding
  const [companyName, setCompanyName] = useState('')
  const [fullName, setFullName] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) throw authError
    } catch (err) {
      setError(err.message || 'Erro ao realizar login')
      setLoading(false)
    }
  }

  const handleOnboarding = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 1. Cadastrar Usuário no Auth do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Não foi possível criar a conta.')

      // 2. Criar a Empresa (Tenant)
      const slug = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('slug', slug)

      if (companyError) throw companyError
      
      const uniqueSlug = companyData.length > 0 ? `${slug}-${Math.floor(Math.random() * 1000)}` : slug

      const { data: newCompany, error: createCompanyError } = await supabase
        .from('companies')
        .insert([{ name: companyName, slug: uniqueSlug }])
        .select()
        .single()

      if (createCompanyError) throw createCompanyError

      // 3. Atualizar/Inserir o perfil do usuário como admin
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          company_id: newCompany.id,
          role: 'admin',
          full_name: fullName,
          email: email
        }])

      if (profileError) throw profileError

      // 4. Inicializar configurações padrão do Admin
      const { error: settingsError } = await supabase
        .from('company_settings')
        .insert([{
          company_id: newCompany.id,
          theme_colors: { primary: '#eab308', secondary: '#1e293b', background: '#0f172a' },
          company_display_name: companyName
        }])

      if (settingsError) throw settingsError

      alert('Cadastro realizado com sucesso! Faça login para acessar o painel.')
      setIsOnboarding(false)
    } catch (err) {
      setError(err.message || 'Erro no processo de onboarding')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center items-center gap-3">
          <div className="bg-yellow-550 p-2.5 rounded-2xl shadow-lg shadow-yellow-500/20">
            <Sun className="h-8 w-8 text-black animate-spin-slow" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-white">
            CRM <span className="text-yellow-400">Solar</span>
          </span>
        </div>
        <h2 className="mt-6 text-center text-xl font-medium text-slate-350">
          {isOnboarding ? 'Cadastre sua Empresa Solar' : 'Entre na sua conta operacional'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-xl py-8 px-4 border border-slate-800/80 shadow-2xl sm:rounded-3xl sm:px-10">
          
          {error && (
            <div className="mb-4 bg-red-950/50 border border-red-800 text-red-200 px-4 py-3 rounded-2xl flex items-center gap-2.5 text-sm">
              <ShieldAlert size={18} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={isOnboarding ? handleOnboarding : handleLogin}>
            
            {isOnboarding && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome"
                    className="mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ex: Sol da Bahia Ltda"
                    className="mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                E-mail
              </label>
              <div className="mt-1.5 relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@empresa.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Senha
              </label>
              <div className="mt-1.5 relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-700 text-black font-semibold rounded-xl shadow-lg transition-all transform active:scale-98"
              >
                {loading ? 'Processando...' : isOnboarding ? 'Cadastrar e Criar Empresa' : 'Entrar no Sistema'}
              </button>
            </div>
          </form>

          {/* Botão de Demonstração / Acesso Direto */}
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={loginDemo}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-750 border border-yellow-500/30 text-yellow-400 hover:text-yellow-300 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              <Zap size={16} className="text-yellow-400" />
              <span>Acessar Modo Demonstração (Sem Login)</span>
            </button>
          </div>

          <div className="mt-6 flex justify-center text-sm">
            <button
              onClick={() => {
                setIsOnboarding(!isOnboarding)
                setError('')
              }}
              className="text-yellow-450 hover:underline"
            >
              {isOnboarding ? 'Já tem conta? Fazer Login' : 'Novo por aqui? Crie seu Tenant do zero'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
