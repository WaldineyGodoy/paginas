
import React from 'react';
import { Button } from './Button';
import { Zap, CheckCircle, MapPin } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-brand-blue overflow-hidden">
      {/* Background graphic/gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-[#0f3460] to-brand-blue z-0"></div>
      
      {/* Decorative circles */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand-orange opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-brand-orange opacity-5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-1.5">
            <Zap size={16} className="text-brand-orange" />
            <span className="text-brand-orange font-bold text-xs tracking-wider uppercase">
              B2W ENERGIA — ASSINANTE CONNECT & PARCEIRO POWER
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight">
            Sua conta de luz com <br/>
            <span className="text-[#10B981]">15% de desconto garantido</span> <br/>
            e a chance de gerar <span className="text-brand-orange">renda recorrente</span>.
          </h1>
          
          <p className="text-gray-300 text-lg sm:text-xl max-w-lg leading-relaxed">
            Sem obras, sem investimento inicial e sem burocracia. Conecte sua conta de luz ao sol e ganhe bônus de 2% (L1) indicando amigos ou construindo sua equipe comercial.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth'})} className="text-base px-8 py-4 bg-[#EE4A22] hover:bg-[#D73A12] border-none text-white shadow-[0_0_24px_rgba(238,74,34,0.35)]">
              Quero meu Desconto Agora
            </Button>
            <Button variant="outline" className="border-[#10B981] text-[#10B981] hover:bg-[#10B981]/10 bg-transparent shadow-[0_4px_16px_rgba(16,185,129,0.1)]" onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth'})}>
              Quero ser um Parceiro Power
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 pt-4 text-gray-400 text-sm font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-[#10B981]" />
              <span>100% amparado pela Lei 14.300</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-[#10B981]" />
              <span>Sem fidelidade abusiva</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-[#10B981]" />
              <span>Energia 100% limpa e renovável</span>
            </div>
          </div>
        </div>

        {/* Hero Image/Graphic */}
        <div className="relative hidden lg:block">
           <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
             <img 
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop" 
              alt="Painéis de energia solar fotovoltaica gerando economia para assinatura de energia B2W" 
              className="object-cover w-full h-[600px] opacity-90 hover:scale-105 transition-transform duration-700"
             />
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-blue to-transparent p-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl max-w-xs">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="text-brand-orange fill-brand-orange" />
                    <span className="text-white font-bold">Economia Garantida</span>
                  </div>
                  <p className="text-gray-200 text-sm">Em breve em todo o Nordeste.</p>
                </div>
             </div>
           </div>
        </div>

      </div>
    </section>
  );
};
