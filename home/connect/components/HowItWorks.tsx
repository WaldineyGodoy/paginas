import React from 'react';
import { UserPlus, Sun, FileText } from 'lucide-react';

const steps = [
  {
    icon: <UserPlus size={40} />,
    title: "1. Assinatura Digital",
    desc: "Faça seu cadastro online. Sem obras, sem custo de adesão e consultando seu CEP para verificar a concessionária."
  },
  {
    icon: <Sun size={40} />,
    title: "2. Geração de Energia",
    desc: "Nossas usinas geram energia limpa e injetam na rede da sua distribuidora (CPFL, Cemig, Enel, etc.) em seu nome."
  },
  {
    icon: <FileText size={40} />,
    title: "3. Duas Faturas (Transparência)",
    desc: "Você recebe a conta da distribuidora (apenas taxa mínima) e a fatura B2W com a energia injetada e seu desconto garantido."
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="como-funciona" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-orange font-bold tracking-wider text-sm">Economia Sustentável e Prática</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-brand-blue mt-2">
            Como Funciona a Energia Solar por Assinatura?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 rounded-2xl bg-brand-blue/5 text-brand-orange flex items-center justify-center mb-6 group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300 shadow-lg">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-blue mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed px-4">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};