
import React from 'react';
import { Check, X, FileCheck, ShieldCheck, Leaf } from 'lucide-react';
import { Button } from './Button';

export const Features: React.FC = () => {
  return (
    <section id="vantagens" className="py-20 bg-brand-blue relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Content */}
          <div className="text-white space-y-8">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold">
              Vantagens da <span className="text-brand-orange">B2W Energia Solar</span>
            </h2>
            <p className="text-gray-300 text-lg">
              Oferecemos a melhor solução em energia solar por assinatura do Brasil. Economize na conta de luz sem precisar de telhado próprio ou investimento em painéis.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-brand-orange/20 p-3 rounded-lg text-brand-orange">
                  <FileCheck size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">Transparência nas Faturas</h4>
                  <p className="text-gray-400 mt-1">
                    Você paga a taxa mínima para a concessionária e a energia consumida para a B2W com desconto. Tudo claro, sem surpresas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brand-orange/20 p-3 rounded-lg text-brand-orange">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">Sem Investimento</h4>
                  <p className="text-gray-400 mt-1">Zero custo de instalação, manutenção ou compra de equipamentos. A responsabilidade técnica é toda nossa.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brand-orange/20 p-3 rounded-lg text-brand-orange">
                  <Leaf size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">Energia 100% Limpa</h4>
                  <p className="text-gray-400 mt-1">Contribua para o meio ambiente reduzindo a pegada de carbono consumindo energia de fontes renováveis.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Comparison Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-gray-800">
            <h3 className="text-2xl font-bold text-brand-blue mb-6 text-center">Comparativo</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-4 border-b pb-4 text-sm font-bold text-gray-500 tracking-wider text-center">
              <div className="text-left pl-4">Item</div>
              <div>Tradicional</div>
              <div className="text-brand-orange">B2W Energia</div>
            </div>

            <div className="space-y-4">
              {[
                { label: "Desconto Garantido", trad: false, b2w: true },
                { label: "Energia Renovável", trad: false, b2w: true },
                { label: "Sem Obras", trad: true, b2w: true },
                { label: "Sem Fidelidade", trad: true, b2w: true },
                { label: "Até 30% Off", trad: false, b2w: true },
              ].map((item, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-4 items-center py-2 border-b border-gray-100 last:border-0">
                  <div className="font-medium text-brand-blue pl-4">{item.label}</div>
                  <div className="flex justify-center">
                    {item.trad ? <Check className="text-gray-400" size={20} /> : <X className="text-red-300" size={20} />}
                  </div>
                  <div className="flex justify-center">
                    {item.b2w ? (
                      <div className="bg-green-100 p-1 rounded-full">
                        <Check className="text-green-600" size={20} />
                      </div>
                    ) : <X className="text-red-500" />}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <Button fullWidth onClick={() => document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth'})}>
                Garantir Meu Desconto
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
