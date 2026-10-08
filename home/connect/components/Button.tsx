import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'white';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg text-sm tracking-wide";
  
  const variants = {
    primary: "bg-brand-orange text-white hover:bg-brand-orangeHover hover:shadow-brand-orange/30",
    outline: "border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white",
    white: "bg-white text-brand-blue hover:bg-gray-100",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};