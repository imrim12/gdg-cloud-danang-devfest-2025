import React, { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

// --- Neo Button ---
interface NeoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const NeoButton: React.FC<NeoButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-bold border-2 border-black transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gdg-blue text-white shadow-neo hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000]",
    secondary: "bg-white text-black shadow-neo hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000]",
    accent: "bg-gdg-yellow text-black shadow-neo hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000]",
    danger: "bg-gdg-red text-white shadow-neo hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000]",
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

// --- Neo Card ---
interface NeoCardProps {
  children: React.ReactNode;
  className?: string;
  color?: 'white' | 'blue' | 'yellow' | 'green' | 'red';
}

export const NeoCard: React.FC<NeoCardProps> = ({ children, className = '', color = 'white' }) => {
  const colors = {
    white: 'bg-white',
    blue: 'bg-gdg-blue/10',
    yellow: 'bg-gdg-yellow/10',
    green: 'bg-gdg-green/10',
    red: 'bg-gdg-red/10'
  };

  return (
    <div className={`border-2 border-black shadow-neo p-6 ${colors[color]} ${className}`}>
      {children}
    </div>
  );
};

// --- Neo Input ---
interface NeoInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const NeoInput: React.FC<NeoInputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block mb-2 font-bold text-sm uppercase tracking-wider">{label}</label>}
      <input 
        className={`w-full border-2 border-black p-3 outline-none focus:shadow-neo transition-all bg-white placeholder:text-gray-400 ${className}`}
        {...props}
      />
    </div>
  );
};

// --- Neo Textarea ---
interface NeoTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const NeoTextarea: React.FC<NeoTextareaProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block mb-2 font-bold text-sm uppercase tracking-wider">{label}</label>}
      <textarea 
        className={`w-full border-2 border-black p-3 outline-none focus:shadow-neo transition-all bg-white placeholder:text-gray-400 min-h-[100px] ${className}`}
        {...props}
      />
    </div>
  );
};

// --- Neo Badge ---
export const NeoBadge: React.FC<{ children: React.ReactNode; color?: 'blue' | 'red' | 'green' | 'yellow' }> = ({ children, color = 'blue' }) => {
    const colors = {
        blue: 'bg-gdg-blue text-white',
        red: 'bg-gdg-red text-white',
        green: 'bg-gdg-green text-white',
        yellow: 'bg-gdg-yellow text-black'
    }
    return (
        <span className={`${colors[color]} px-2 py-1 text-xs border-2 border-black font-bold uppercase inline-block shadow-[2px_2px_0px_0px_#000]`}>
            {children}
        </span>
    )
}