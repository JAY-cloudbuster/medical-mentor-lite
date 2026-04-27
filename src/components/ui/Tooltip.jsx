import React from 'react';

const Tooltip = ({ children, text, position = 'top' }) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative group flex items-center justify-center cursor-help">
      {children}
      <div className={`absolute ${positionClasses[position]} px-3 py-1.5 bg-surface text-on-surface text-xs rounded-lg border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-2xl pointer-events-none`}>
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
