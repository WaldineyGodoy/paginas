
import React from 'react';

interface LogoProps {
  variant?: 'white' | 'color';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'color', className = '' }) => {
  const textColor = variant === 'white' ? 'text-white' : 'text-brand-orange';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src="https://b2wenergia.com.br/wp-content/uploads/2025/12/Logo-Laranja-estreito.png" 
        alt="B2W Energia" 
        className="h-12 w-auto"
      />
      
      <div className={`font-heading font-bold text-2xl tracking-wide ${textColor}`}>
        B2W <span className="font-normal">ENERGIA</span>
      </div>
    </div>
  );
};
