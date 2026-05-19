import React from 'react';

const Badge = ({ children, variant = 'default' }) => {
  const styles = {
    default: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    warning: 'bg-amber-50 text-amber-600 border-amber-200',
    error: 'bg-rose-50 text-rose-600 border-rose-200',
    muted: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant] || styles.default}`}>
      {children}
    </span>
  );
};

export default Badge;
