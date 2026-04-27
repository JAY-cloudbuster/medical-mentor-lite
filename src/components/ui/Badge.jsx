import React from 'react';

const Badge = ({ children, color = 'primary' }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}/10 text-${color} border border-${color}/20`}>
      {children}
    </span>
  );
};

export default Badge;
