
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ArrowRight,
  Download, 
  Lightbulb, 
  ShieldCheck, 
  FileCheck, 
  AppWindow, 
  History, 
  TrendingDown, 
  Eye,
  UserCheck
} from 'lucide-react';
import { CLAUSES } from './constants';
import ClauseCard from './components/ClauseCard';

const LOGO_URL = "https://b2wenergia.com.br/wp-content/uploads/2025/12/Logo-Laranja-estreito.png";

/**
 * Botão de assinatura.
 *
 * Sem link, vira um aviso em vez de um `<a href="#">`: um botão que parece
 * clicável e não faz nada é pior do que dizer que o link está a caminho —
 * era exatamente o que acontecia quando a página era aberta sem parâmetro.
 */
const SignatureCTA: React.FC<{ link: string; className?: string }> = ({ link, className = "" }) => {
  if (!link) {
    return (
      <div className={`bg-gray-100 text-brand-gray px-8 py-4 rounded-2xl font-bold inline-flex items-center gap-3 border border-gray-200 ${className}`}>
        <ArrowRight className="w-5 h-5 opacity-40" />
        Seu link de assinatura chega pelo WhatsApp
      </div>
    );
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`bg-brand-orange text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all hover:bg-brand-dark group shadow-xl shadow-brand-orange/20 active:scale-95 inline-flex ${className}`}
    >
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      Assinar Contrato de adesão
    </a>
  );
};

const App: React.FC = () => {
  const [readProgress, setReadProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Parâmetros dinâmicos da URL
  //
  // A onboarding-finalizar v4 manda só Linkdocontrato, nome, concessionaria
  // e desconto — nunca cpf nem endereco. Esta página nunca leu esses dois
  // campos de volta no contrato (o PDF vem pronto do backend), então não há
  // por que exibi-los aqui; e "COSERN"/"20%" como padrão citava dado errado
  // sempre que o parâmetro faltava, então os defaults viraram texto genérico.
  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const userData = useMemo(() => ({
    nome: urlParams.get('nome') || 'Associado',
    concessionaria: urlParams.get('concessionaria') || '',
    desconto: urlParams.get('desconto') || '',
    // `Linkdocontrato` é o nome que a edge function `onboarding-finalizar`
    // envia. `link` fica como legado. Sem nenhum dos dois a página caía em
    // '#' e os quatro botões "Assinar Contrato de adesão" não faziam nada.
    linkAssinatura: urlParams.get('Linkdocontrato') || urlParams.get('link') || '',
  }), [urlParams]);

  const temLink = Boolean(userData.linkAssinatura);
  const concessionariaLabel = userData.concessionaria || 'sua distribuidora';
  // Frase pronta para uso corrido ("o desconto de 15%" / "o desconto informado
  // na sua simulação"); `descontoValorLabel` fica só o número+"%" ou o texto
  // genérico, para títulos curtos.
  const descontoFraseLabel = userData.desconto
    ? `o desconto de ${userData.desconto}%`
    : 'o desconto informado na sua simulação';
  const descontoValorLabel = userData.desconto ? `${userData.desconto}%` : 'o desconto informado na sua simulação';

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = Math.min(Math.round((scrolled / totalHeight) * 100), 100);
      setReadProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <div className={`min-h-screen flex flex-col bg-brand-bg ${isFinished ? 'h-screen overflow-hidden' : ''}`}>
      {/* Header / Nav */}
      <nav className="no-print sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={LOGO_URL} alt="B2W Energia" className="h-10 w-auto" />
            <div className="hidden sm:block border-l pl-4 border-gray-200">
              <h1 className="text-sm font-extrabold tracking-tight text-brand-dark uppercase">Onboarding</h1>
              <p className="text-[10px] text-brand-orange font-bold uppercase tracking-widest">Energia por Assinatura</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <SignatureCTA link={userData.linkAssinatura} className="hidden md:flex px-6 py-3 text-sm" />
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase tracking-widest text-brand-gray font-bold mb-1">Status da Leitura</p>
              <div className="flex items-center gap-3">
                <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-orange h-full rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${readProgress}%` }}
                  ></div>
                </div>
                <span className="text-xs font-black text-brand-orange">{readProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Bloco explicativo: Como Funciona */}
      <section className="bg-white py-20 no-print border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-6">
              Bem-vindo, <span className="text-brand-orange">{userData.nome}</span>!
            </h2>
            <p className="text-xl text-brand-gray max-w-3xl mx-auto font-medium leading-relaxed">
              Veja como a sua economia é gerada e como o sistema funciona em parceria com a <span className="text-brand-orange font-bold uppercase">{concessionariaLabel}</span>.
            </p>
          </div>

          {/* Conferência dos dados que vão para o contrato. A onboarding-finalizar
              v4 não manda mais cpf/endereco pra cá (o PDF já sai pronto do
              backend), então o resumo mostra só o que a URL de fato traz:
              titular, distribuidora e desconto. */}
          {temLink && (
            <div className="max-w-3xl mx-auto mb-16 p-8 rounded-[32px] bg-brand-bg border border-gray-100">
              <p className="text-[10px] uppercase tracking-widest text-brand-gray font-black mb-6">
                Confira os dados do seu contrato
              </p>
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                <div>
                  <dt className="text-[10px] uppercase tracking-widest text-brand-gray font-bold mb-1">Titular</dt>
                  <dd className="font-bold text-brand-dark">{userData.nome}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-widest text-brand-gray font-bold mb-1">Distribuidora</dt>
                  <dd className="font-bold text-brand-dark">{concessionariaLabel}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-widest text-brand-gray font-bold mb-1">Desconto</dt>
                  <dd className="font-bold text-brand-dark">{descontoValorLabel}</dd>
                </div>
              </dl>
              <p className="text-sm text-brand-gray mt-6">
                Algo errado? Responda nosso WhatsApp antes de assinar que a gente corrige.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Lightbulb, title: "01. Geração Limpa", text: "Geramos energia em nossas usinas solares renováveis." },
              { icon: TrendingDown, title: "02. Injeção na Rede", text: `Injetamos a energia na rede da distribuidora ${concessionariaLabel}.` },
              { icon: Download, title: userData.desconto ? `03. Desconto de ${userData.desconto}%` : "03. Seu Desconto", text: `Garantimos ${descontoFraseLabel} sobre a energia compensada.` },
              { icon: AppWindow, title: "04. App Inteligente", text: "Acompanhe consumo, faturas e economia direto pelo aplicativo B2W." },
              { icon: ShieldCheck, title: "05. Continuidade", text: `A ${concessionariaLabel} segue responsável pela entrega física da energia.` },
              { icon: FileCheck, title: "06. Sem Obras", text: `Não precisa de placas no telhado. Usamos a infraestrutura da ${concessionariaLabel}.` },
              { icon: Eye, title: "07. Transparência", text: "Você recebe o demonstrativo da concessionária e o boleto B2W com desconto." },
              { icon: History, title: "08. Sem Fidelidade", text: "Cancele quando quiser. Pedimos apenas 90 dias para ajuste nos ciclos." },
            ].map((step, idx) => (
              <div key={idx} className="p-8 rounded-[32px] bg-brand-bg border border-gray-100 hover:border-brand-orange/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-brand-orange/5 rounded-bl-[32px] flex items-center justify-center text-brand-orange/30 font-black text-2xl group-hover:scale-110 transition-transform">
                  {idx + 1}
                </div>
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-orange shadow-sm mb-6">
                  <step.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-brand-dark mb-3 text-lg leading-tight">{step.title}</h4>
                <p className="text-sm text-brand-gray leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Bloco: Entenda o seu contrato (Cards 17 Pontos) */}
      <main id="content" className="max-w-7xl mx-auto px-6 py-24 no-print">
        <div className="mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-brand-dark mb-8 tracking-tight">
            Entenda o seu <span className="text-brand-orange">contrato.</span>
          </h2>
          <p className="text-xl text-brand-gray max-w-2xl font-medium leading-relaxed mb-8">
            Resumimos as 22 cláusulas do documento oficial para que você assine com total clareza e segurança jurídica.
          </p>
          <SignatureCTA link={userData.linkAssinatura} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {CLAUSES.map((clause) => (
            <ClauseCard key={clause.id} clause={clause} />
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <SignatureCTA link={userData.linkAssinatura} className="px-12 py-6 text-xl" />
        </div>
      </main>


      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-24 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16">
            <div className="max-w-sm">
              <img src={LOGO_URL} alt="B2W" className="h-10 w-auto mb-8" />
              <p className="text-brand-gray text-sm leading-relaxed mb-10 font-medium">
                Democratizando o acesso à energia renovável com transparência, tecnologia e segurança.
              </p>
              <SignatureCTA link={userData.linkAssinatura} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
              <div>
                <h5 className="font-black text-brand-dark mb-8 text-xs uppercase tracking-widest">Suporte</h5>
                <ul className="space-y-4 text-sm text-brand-gray font-bold">
                  <li><a href="#" className="hover:text-brand-orange transition-colors">Como funciona</a></li>
                  <li><a href="#" className="hover:text-brand-orange transition-colors">WhatsApp B2W</a></li>
                  <li><a href="#" className="hover:text-brand-orange transition-colors">Dúvidas Frequentes</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-black text-brand-dark mb-8 text-xs uppercase tracking-widest">Segurança</h5>
                <ul className="space-y-4 text-sm text-brand-gray font-bold">
                  <li><a href="#" className="hover:text-brand-orange transition-colors">Privacidade</a></li>
                  <li><a href="#" className="hover:text-brand-orange transition-colors">Termos de Uso</a></li>
                  <li><a href="#" className="hover:text-brand-orange transition-colors">Lei 14.300</a></li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="flex items-center gap-3 text-green-600 font-black text-[10px] uppercase tracking-widest">
                  <UserCheck className="w-6 h-6" />
                  Padrão {concessionariaLabel}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
