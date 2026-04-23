import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    // Radius System: R (32px)
    // Optics: Blur 40px, Saturate 180%, White 8%
    // Edge: Handled by 'glass-edge' class in global CSS (inset shadows)
    <div className={`bg-white/[0.08] backdrop-blur-[40px] backdrop-saturate-[180%] rounded-[32px] glass-edge ${className}`}>
      {children}
    </div>
  );
};