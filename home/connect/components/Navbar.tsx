
import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Button } from './Button';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC<{ onAssineAgora: () => void }> = ({ onAssineAgora }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Como Funciona', href: '#como-funciona' },
    { name: 'Vantagens', href: '#vantagens' },
    { name: 'Dúvidas', href: '#faq' },
  ];

  const handleLogin = () => {
    window.location.href = 'https://app.b2wenergia.com.br/login';
  };

  const handleEmbaixador = () => {
    window.open('https://b2wenergia.com.br/embaixador', '_blank');
  };

  const handleAssineAgora = () => {
    onAssineAgora();
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <Logo variant={isScrolled ? 'color' : 'white'} />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium hover:text-brand-orange transition-colors ${isScrolled ? 'text-brand-blue' : 'text-white'}`}
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={handleEmbaixador}
              className={`text-sm font-medium hover:text-brand-orange transition-colors ${isScrolled ? 'text-brand-blue' : 'text-white'}`}
            >
              Seja um embaixador
            </button>
            <button
              onClick={handleLogin}
              className={`text-sm font-medium hover:text-brand-orange transition-colors ${isScrolled ? 'text-brand-blue' : 'text-white'}`}
            >
              Login
            </button>
            <Button
              variant={isScrolled ? 'primary' : 'white'}
              onClick={handleAssineAgora}
              className="px-5 py-2 text-sm"
            >
              Assine agora
            </Button>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={isScrolled ? 'text-brand-blue' : 'text-white'}>
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-xl border-t border-gray-100 py-6 flex flex-col items-center space-y-4 animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-brand-blue font-medium text-lg"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleEmbaixador();
            }}
            className="text-brand-blue font-medium text-lg"
          >
            Seja um embaixador
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleLogin();
            }}
            className="text-brand-blue font-medium text-lg"
          >
            Login
          </button>
          <Button
            fullWidth
            className="max-w-[250px]"
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleAssineAgora();
            }}
          >
            Assine agora
          </Button>
        </div>
      )}
    </nav>
  );
};
