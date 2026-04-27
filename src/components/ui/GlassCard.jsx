import React from 'react';

const GlassCard = ({ children, className = '', hoverEffect = true }) => {
  return (
    <div className={`
      bg-surface-container/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6
      ${hoverEffect ? 'hover:shadow-[0_0_20px_rgba(67,243,246,0.15)] hover:border-white/10 transition-all duration-300' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default GlassCard;
