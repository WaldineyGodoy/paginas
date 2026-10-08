
import React from 'react';
import { Logo } from './Logo';
import { Button } from './Button';
import { Instagram, Facebook, Linkedin, Mail, Phone } from 'lucide-react';

export const Footer: React.FC<{ onAssineAgora: () => void }> = ({ onAssineAgora }) => {
  const handleGarantirDesconto = () => {
    onAssineAgora();
  };

  return (
    <footer className="bg-brand-blue text-white pt-20 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Info */}
          <div className="space-y-6">
            <Logo variant="white" />
            <p className="text-gray-400 text-sm leading-relaxed">
              A B2W Energia democratiza o acesso à energia limpa. Economia garantida sem obras e sem burocracia para sua casa ou empresa.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/b2wenergia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-orange transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/b2wenergia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-orange transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.linkedin.com/company/b2wenergiasolar/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-orange transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
            <div className="pt-4">
              <Button onClick={handleGarantirDesconto} className="shadow-brand-orange/20">
                Garantir meu desconto
              </Button>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-brand-orange font-bold tracking-wider mb-6">Navegação</h4>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li><a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a></li>
              <li><a href="#vantagens" className="hover:text-white transition-colors">Vantagens</a></li>
              <li><a href="#simulador" className="hover:text-white transition-colors">Simulador</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Dúvidas Frequentes</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-brand-orange font-bold tracking-wider mb-6">Contato</h4>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-brand-orange" />
                <span>(31) 99536-7744</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-brand-orange" />
                <span>contato@b2wenergia.com.br</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-orange font-bold">Cobertura</span>
                <span>SP, RN, RJ, PR, MT, MS, MG e GO.</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-brand-orange font-bold tracking-wider mb-6">Legal</h4>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LGPD</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} B2W Energia. Todos os direitos reservados.</p>
          <p className="mt-2 md:mt-0">Feito com energia limpa ☀️</p>
        </div>
      </div>
    </footer>
  );
};
