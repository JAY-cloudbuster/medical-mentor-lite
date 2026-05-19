import React from 'react';

const GlassPanel = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`card-panel ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
