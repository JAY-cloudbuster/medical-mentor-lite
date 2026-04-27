import React from 'react';

const NeonButton = ({ children, onClick, color = 'primary', className = '' }) => {
  return (
    <button 
      onClick={onClick}
      className={`relative group overflow-hidden px-8 py-3 rounded-full font-bold tracking-widest uppercase text-sm border border-${color} text-${color} hover:bg-${color} hover:text-black transition-all duration-300 ${className}`}
    >
      <span className={`absolute inset-0 bg-${color} blur-md opacity-0 group-hover:opacity-40 transition-opacity`}></span>
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default NeonButton;
