import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
  subtitle?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", onClick, title, subtitle }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-glass-100 backdrop-blur-[25px] 
        border border-white/20 
        shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
        rounded-[24px] 
        p-6 
        transition-all duration-300 ease-out
        hover:bg-glass-200 hover:border-white/30
        text-white
        ${className}
      `}
    >
        {(title || subtitle) && (
            <div className="mb-4 border-b border-white/10 pb-2">
                {title && <h3 className="text-xl font-light tracking-wide text-white">{title}</h3>}
                {subtitle && <p className="text-sm text-gray-400 font-light mt-1">{subtitle}</p>}
            </div>
        )}
      {children}
    </div>
  );
};